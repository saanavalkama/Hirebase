using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hirebase.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGitHubProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GitHubProfile_CandidateProfiles_CandidateProfileId",
                table: "GitHubProfile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GitHubProfile",
                table: "GitHubProfile");

            migrationBuilder.RenameTable(
                name: "GitHubProfile",
                newName: "GitHubProfiles");

            migrationBuilder.RenameIndex(
                name: "IX_GitHubProfile_CandidateProfileId",
                table: "GitHubProfiles",
                newName: "IX_GitHubProfiles_CandidateProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GitHubProfiles",
                table: "GitHubProfiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GitHubProfiles_CandidateProfiles_CandidateProfileId",
                table: "GitHubProfiles",
                column: "CandidateProfileId",
                principalTable: "CandidateProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GitHubProfiles_CandidateProfiles_CandidateProfileId",
                table: "GitHubProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GitHubProfiles",
                table: "GitHubProfiles");

            migrationBuilder.RenameTable(
                name: "GitHubProfiles",
                newName: "GitHubProfile");

            migrationBuilder.RenameIndex(
                name: "IX_GitHubProfiles_CandidateProfileId",
                table: "GitHubProfile",
                newName: "IX_GitHubProfile_CandidateProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GitHubProfile",
                table: "GitHubProfile",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GitHubProfile_CandidateProfiles_CandidateProfileId",
                table: "GitHubProfile",
                column: "CandidateProfileId",
                principalTable: "CandidateProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
