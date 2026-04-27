using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hirebase.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGitHubSignals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RawDataJson",
                table: "GitHubProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GitHubSignals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GitHubProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityScore = table.Column<int>(type: "integer", nullable: false),
                    RepoMaturityScore = table.Column<int>(type: "integer", nullable: false),
                    PopularityScore = table.Column<int>(type: "integer", nullable: false),
                    TopLanguages = table.Column<string>(type: "text", nullable: false),
                    ExternalPrCount = table.Column<int>(type: "integer", nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GitHubSignals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GitHubSignals_GitHubProfiles_GitHubProfileId",
                        column: x => x.GitHubProfileId,
                        principalTable: "GitHubProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GitHubSignals_GitHubProfileId",
                table: "GitHubSignals",
                column: "GitHubProfileId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GitHubSignals");

            migrationBuilder.DropColumn(
                name: "RawDataJson",
                table: "GitHubProfiles");
        }
    }
}
