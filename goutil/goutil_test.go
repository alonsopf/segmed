package goutil
import (
	"testing"
)

func IsSHA512(input string) string {
	return ToSha512([]byte(input))
}

func TestSHA512(t *testing.T) {
	expected := "1qG05wqBwhyjE45d66cnZwYHrUD+MVEBOe2sFDtZoAdXGls0g6xchvQsd2Um5dok8fmF58X4khqvQDP+3ZwIsw=="
	got := IsSHA512("segmedai")
	if got != expected {
		t.Errorf("Expected: %v, got: %v", expected, got)
	}
}