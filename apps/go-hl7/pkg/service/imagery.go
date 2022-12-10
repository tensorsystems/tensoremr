/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package service

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"runtime"
)

type ImageryWorklistMessage struct {
	StudyInstanceUId             string
	AppointmentID                string
	Modality                     string
	PatientDateOfBirth           string
	RequestedProcedureId         string
	SendingFacility              string
	TimeOfMessage                string
	PatientID                    string
	PatientSex                   string
	PatientPhoneNo               string
	PatientFirstName             string
	PatientLastName              string
	PhysicianID                  string
	PhysicianFirstName           string
	PhysicianLastName            string
	DiagnosticProcedureID        string
	DiagnosticProcedureTypeID    string
	DiagnosticProcedureTypeTitle string
}

// CreateWorklist ...
func (w *ImageryWorklistMessage) CreateWorklistFile() error {
	body := fmt.Sprintf(

		`MSH|^~\&|TENSOREMR|%s|%s|%s|%s||OMI^O23^OMI_O23|%s|P|2.8
PID|1||%s^^^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR||%s^%s||%s|%s|||||%s
PV1|1|O|%s^%s^%s||||%s^%s^%s|%s^%s^%s|%s^%s^%s|OP|||||||||%s^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR||||||||
ORC|NW|%s^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR|||SC||||||||||||
OBR|1|%s^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR||||||||||||||||OMRP1345|OMRP1345|OMSPS1372||||%s||||||||||||||||||||%s^%s
IPC|%s|%s^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR|%s^TENSOREMR^TENSOREMR.TENSORSYSTEMS.NET^URI^MR||%s	
`,
		w.SendingFacility,
		w.Modality,
		w.SendingFacility,
		w.TimeOfMessage,
		w.RequestedProcedureId,
		w.PatientID,
		w.PatientLastName,
		w.PatientFirstName,
		w.PatientDateOfBirth,
		w.PatientSex,
		w.PatientPhoneNo,
		w.PhysicianID,
		w.PhysicianLastName,
		w.PhysicianFirstName,
		w.PhysicianID,
		w.PhysicianLastName,
		w.PhysicianFirstName,
		w.PhysicianID,
		w.PhysicianLastName,
		w.PhysicianFirstName,
		w.PhysicianID,
		w.PhysicianLastName,
		w.PhysicianFirstName,
		w.AppointmentID,
		w.RequestedProcedureId,
		w.RequestedProcedureId,
		w.Modality,
		w.DiagnosticProcedureTypeID,
		w.DiagnosticProcedureTypeTitle,
		w.PatientID,
		w.RequestedProcedureId,
		w.StudyInstanceUId,
		w.Modality,
	)

	worklistDir := os.Getenv("HL7_WORKLIST_DIR")
	fileName := w.DiagnosticProcedureID + ".hl7"

	f, err := os.Create(worklistDir + "/hl7-archive/" + fileName)

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

	return nil
}

func (w *ImageryWorklistMessage) SendToPacs() error {
	dir := os.Getenv("HL7_WORKLIST_DIR")
	hl7Address := os.Getenv("HL7_ADDRESS")

	bin := ""

	os := runtime.GOOS

	if os == "windows" {
		bin = "./dcm4che/bin/hl7snd.bat"
	} else {
		bin = "./dcm4che/bin/hl7snd"
	}

	cmd := exec.Command(bin, "-c", hl7Address, "./hl7-archive/"+w.DiagnosticProcedureID+".hl7")
	cmd.Dir = dir
	_, err := cmd.Output()

	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil

}
