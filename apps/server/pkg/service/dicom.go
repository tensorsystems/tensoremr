package service

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strconv"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
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

// CreateWorklist ...
func CreateWorklist(dicomStudyUid string, modality string, patient models.Patient, physician models.User, diagnosticProcedure models.DiagnosticProcedure) error {
	patientSex := ""
	if patient.Gender == "Male" {
		patientSex = "M"
	} else if patient.Gender == "Female" {
		patientSex = "F"
	} else {
		patientSex = "U"
	}

	year, month, day := patient.DateOfBirth.Date()

	accessionNumber := "00000"
	patientName := patient.FirstName + "^" + patient.LastName
	patientId := strconv.Itoa(patient.ID)
	patientDateOfBirth := strconv.Itoa(year) + strconv.Itoa(int(month)) + strconv.Itoa(day)
	studyUid := dicomStudyUid
	requestingPhysician := physician.FirstName + "^" + physician.LastName
	requestedProcedureDescription := diagnosticProcedure.DiagnosticProcedureTypeTitle
	requestedProcedureId := strconv.Itoa(diagnosticProcedure.ID)

	body := fmt.Sprintf(
		`
# Dicom-File-Format

# Dicom-Meta-Information-Header
# Used TransferSyntax: Little Endian Explicit
(0002,0000) UL 202                                      #   4, 1 FileMetaInformationGroupLength
(0002,0001) OB 00\01                                    #   2, 1 FileMetaInformationVersion
(0002,0002) UI [1.2.276.0.7230010.3.1.0.1]              #  26, 1 MediaStorageSOPClassUID
(0002,0003) UI [1.2.276.0.7230010.3.1.4.2831176407.11154.1448031138.805061] #  58, 1 MediaStorageSOPInstanceUID
(0002,0010) UI =LittleEndianExplicit                    #  20, 1 TransferSyntaxUID
(0002,0012) UI [1.2.276.0.7230010.3.0.3.6.0]            #  28, 1 ImplementationClassUID
(0002,0013) SH [OFFIS_DCMTK_360]                        #  16, 1 ImplementationVersionName

# Dicom-Data-Set 
# Used TransferSyntax: Little Endian Explicit
(0008,0005) CS [ISO_IR 100]                             #  10, 1 SpecificCharacterSet
(0008,0050) SH [%s]                                     #   6, 1 AccessionNumber
(0010,0010) PN [%s]                                     #  16, 1 PatientName
(0010,0020) LO [%s]                                     #   8, 1 PatientID
(0010,0030) DA [%s]                                     #   8, 1 PatientBirthDate
(0010,0040) CS [%s]                                     #   2, 1 PatientSex
(0020,000d) UI [%s]                                     #  26, 1 StudyInstanceUID
(0032,1032) PN [%s]                                     #   6, 1 RequestingPhysician
(0032,1060) LO [%s]                                     #   6, 1 RequestedProcedureDescription
(0040,1001) SH [%s]                                     #  10, 1 RequestedProcedureID
(0040,1003) SH [LOW]                                    #   4, 1 RequestedProcedurePriority
(0008,0060) CS [%s]                                     #   2, 1 Modality
	`,
		accessionNumber,
		patientName,
		patientId,
		patientDateOfBirth,
		patientSex,
		studyUid,
		requestingPhysician,
		requestedProcedureDescription,
		requestedProcedureId,
		modality,
	)

	worklistDir := os.Getenv("DCM_WORKLIST_WORKING_DIR")
	textFileName := strconv.Itoa(diagnosticProcedure.ID) + ".txt"

	f, err := os.Create(worklistDir + "/" + textFileName)

	if err != nil {
		log.Println(err)
		return err
	}

	defer f.Close()

	data := []byte(body)

	_, err2 := f.Write(data)
	if err2 != nil {
		log.Println(err)
		return err
	}

	if err := DumpToDicom(textFileName, strconv.Itoa(diagnosticProcedure.ID)+".wl"); err != nil {
		log.Println(err)
		return err
	}

	return nil
}

// DumpToDicom ...
func DumpToDicom(textFileNameArg, worklistFileNameArg string) error {
	dir := os.Getenv("DCM_WORKLIST_WORKING_DIR")

	bin := ""

	os := runtime.GOOS
	switch os {
	case "darwin":
		bin = "./dump2dcm-macos"
	case "linux":
		bin = "./dump2dcm-linux"
	default:
		bin = "./dump2dcm-linux"
	}

	cmd := exec.Command(bin, textFileNameArg, worklistFileNameArg)
	cmd.Dir = dir
	out, err := cmd.Output()
	if err != nil {
		log.Println(err)
		return err
	}

	log.Println(out)

	return nil
}
