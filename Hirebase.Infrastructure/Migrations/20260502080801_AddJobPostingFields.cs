using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hirebase.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddJobPostingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CretedAt",
                table: "JobPostings",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<string>(
                name: "JobPostingSoftSkills",
                table: "JobPostings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredRole",
                table: "JobPostings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequiredLanguages",
                table: "JobPostings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobPostingSoftSkills",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "PreferredRole",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "RequiredLanguages",
                table: "JobPostings");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "JobPostings",
                newName: "CretedAt");
        }
    }
}
