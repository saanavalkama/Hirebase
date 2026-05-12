using FuzzySharp;
using Hirebase.Application.DTOs.Matching;
using Hirebase.Application.Interfaces;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;
using System.Text.Json;

namespace Hirebase.Application.Services;

public class PotentialMatchService : IPotentialMatchService
{
    private readonly ICandidateProfileRepository _candidateRepo;
    private readonly IJobPostingRepository _jobRepo;
    private readonly IPotentialMatchRepository _matchRepo;

    private const int FuzzyThreshold = 80;

    public PotentialMatchService(
        ICandidateProfileRepository candidateRepo,
        IJobPostingRepository jobRepo,
        IPotentialMatchRepository matchRepo)
    {
        _candidateRepo = candidateRepo;
        _jobRepo = jobRepo;
        _matchRepo = matchRepo;
    }

    public async Task ScoreForCandidate(Guid candidateProfileId)
    {
        var candidate = await _candidateRepo.GetProfileById(candidateProfileId);
        if (candidate == null) return;

        var jobs = await _jobRepo.GetAllActive();

        foreach (var job in jobs)
        {
            var tier = CalculateTier(candidate, job);
            if (tier == MatchTier.NoMatch)
            {
                await _matchRepo.Delete(candidateProfileId, job.Id);
                continue;
            }
            await _matchRepo.Upsert(candidateProfileId, job.Id, tier);
        }
    }

    public async Task ScoreForJob(Guid jobPostingId)
    {
        var job = await _jobRepo.GetById(jobPostingId);
        if (job == null) return;

        var candidates = await _candidateRepo.GetAllProfiles();

        foreach (var candidate in candidates)
        {
            var tier = CalculateTier(candidate, job);
            if (tier == MatchTier.NoMatch)
            {
                await _matchRepo.Delete(candidate.Id, jobPostingId);
                continue;
            }
            await _matchRepo.Upsert(candidate.Id, jobPostingId, tier);
        }
    }

    private MatchTier CalculateTier(CandidateProfile candidate, JobPosting job)
    {
        // Gate 1 — seniority
        if (job.SeniorityLevel != null && candidate.SeniorityLevel != null)
        {
            if (candidate.SeniorityLevel != job.SeniorityLevel)
                return MatchTier.NoMatch;
        }

        // Gate 2 — skill overlap
        var jobSkills = JsonSerializer.Deserialize<List<string>>(job.RequiredLanguages ?? "[]") ?? [];
        var candidateSkills = GetCandidateSkills(candidate);

        var hasSkillOverlap = jobSkills.Any(jobSkill =>
            candidateSkills.Any(candidateSkill =>
                Fuzz.Ratio(jobSkill.ToLower(), candidateSkill.ToLower()) >= FuzzyThreshold));

        if (!hasSkillOverlap)
            return MatchTier.Partial;

        // Gate 3 — soft skill overlap (bonus)
        var jobSoftSkills = JsonSerializer.Deserialize<List<string>>(job.JobPostingSoftSkills ?? "[]") ?? [];
        var candidateSoftSkills = candidate.SoftSkills.Select(s => s.Skill.ToString().ToLower()).ToList();

        var hasSoftSkillOverlap = jobSoftSkills.Any(js =>
            candidateSoftSkills.Any(cs =>
                Fuzz.Ratio(js.ToLower(), cs) >= FuzzyThreshold));

        return hasSoftSkillOverlap ? MatchTier.StrongFit : MatchTier.GoodFit;
    }

    private List<string> GetCandidateSkills(CandidateProfile candidate)
    {
        var skills = new List<string>();

        
        
        if (candidate.GitHubProfile?.Signals != null)
        {
            var languages = JsonSerializer.Deserialize<List<string>>(
                candidate.GitHubProfile.Signals.TopLanguages) ?? [];
            skills.AddRange(languages);
        }

        return skills;
    }

    public async Task<List<PotentialMatchResponseDto>> GetMyMatches(Guid userId)
    {
        var profile = await _candidateRepo.GetProfileByUserId(userId)
            ?? throw new NotFoundException("Candidate profile");

        var matches = await _matchRepo.GetByCandidate(profile.Id);

        return matches.Select(m => new PotentialMatchResponseDto(
            m.JobPostingId,
            m.Tier.ToString()
        )).ToList();
}
}