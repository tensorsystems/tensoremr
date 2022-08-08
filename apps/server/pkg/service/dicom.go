package service

import (
	"io"
	"net/http"
	"os"
)

// GenerateStudyUid ...
func GenerateStudyUid() (*string, error) {
	baseUrl := os.Getenv("DICOM_ADDRESS")

	requestUrl := baseUrl + "/tools/generate-uid?level=study"

	resp, err := http.Get(requestUrl)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	uid := string(body)

	return &uid, nil
}
