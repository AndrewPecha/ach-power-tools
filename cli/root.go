package cli

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var rootCmd = &cobra.Command{
	Use:   "achpt",
	Short: "achpt is a cli tool for working with ACH files",
	Long:  "achpt is a cli tool for working with ACH files - creating, reading, and modifying",
	Run: func(cmd *cobra.Command, args []string) {
		println("hi")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Oops. An error while executing achpt '%s'\n", err)
		os.Exit(1)
	}
}
