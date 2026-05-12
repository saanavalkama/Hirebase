using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hirebase.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixApplicationEntityTypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppledAt",
                table: "CandidateApplications",
                newName: "AppliedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppliedAt",
                table: "CandidateApplications",
                newName: "AppledAt");
        }
    }
}
