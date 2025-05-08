package cli

import (
	"ach-power-tools/achpt"
	"github.com/spf13/cobra"
)

var sampleAchCmd = &cobra.Command{
	Use:     "sample-ach",
	Aliases: []string{"sample-ach"},
	Run: func(cmd *cobra.Command, args []string) {
		print(achpt.CreateSampleAch())
	},
}

func init() {
	rootCmd.AddCommand(sampleAchCmd)
}
