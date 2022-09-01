package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePatient(ctx context.Context, input graph_models.PatientInput) (*models.Patient, error) {
	// Copy
	var patient models.Patient
	deepCopy.Copy(&input).To(&patient)

	// Upload paper record document
	if input.PaperRecordDocument != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.PaperRecordDocument.Name)
		err := WriteFile(input.PaperRecordDocument.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.PaperRecordDocument = &models.File{
			ContentType: input.PaperRecordDocument.File.ContentType,
			Size:        input.PaperRecordDocument.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	// Upload other doucments
	for _, fileUpload := range input.Documents {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)
		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.Documents = append(patient.Documents, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	// Save
	if err := r.PatientRepository.Save(&patient); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "patients-update", patient.ID)

	// Return
	return &patient, nil
}

func (r *mutationResolver) SavePatientV2(ctx context.Context, input graph_models.PatientInputV2, dateOfBirthInput graph_models.DateOfBirthInput) (*models.Patient, error) {
	// Copy
	var patient models.Patient
	deepCopy.Copy(&input).To(&patient)

	var dateOfBirth time.Time

	now := time.Now()

	if dateOfBirthInput.InputType == graph_models.DateOfBirthInputTypeDate {
		dateOfBirth = *dateOfBirthInput.DateOfBirth
	} else if dateOfBirthInput.InputType == graph_models.DateOfBirthInputTypeAgeYear {
		dateOfBirth = now.AddDate(-*dateOfBirthInput.AgeInYears, 0, 0)
	} else if dateOfBirthInput.InputType == graph_models.DateOfBirthInputTypeAgeMonth {
		dateOfBirth = now.AddDate(0, -*dateOfBirthInput.AgeInMonths, 0)
	}

	patient.DateOfBirth = dateOfBirth

	// Upload paper record document
	if input.PaperRecordDocument != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.PaperRecordDocument.Name)
		err := WriteFile(input.PaperRecordDocument.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.PaperRecordDocument = &models.File{
			ContentType: input.PaperRecordDocument.File.ContentType,
			Size:        input.PaperRecordDocument.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	// Upload other doucments
	for _, fileUpload := range input.Documents {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)
		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.Documents = append(patient.Documents, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}
	// Save
	if err := r.PatientRepository.Save(&patient); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "patients-update", patient.ID)

	// Return
	return &patient, nil
}

func (r *mutationResolver) UpdatePatient(ctx context.Context, input graph_models.PatientUpdateInput) (*models.Patient, error) {
	var patient models.Patient
	deepCopy.Copy(&input).To(&patient)

	// Upload paper record document
	if input.PaperRecordDocument != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.PaperRecordDocument.Name)
		err := WriteFile(input.PaperRecordDocument.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.PaperRecordDocument = &models.File{
			ContentType: input.PaperRecordDocument.File.ContentType,
			Size:        input.PaperRecordDocument.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	// Upload other doucments
	for _, fileUpload := range input.Documents {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)
		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		patient.Documents = append(patient.Documents, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	if err := r.PatientRepository.Update(&patient); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "patients-update", patient.ID)

	return &patient, nil
}

func (r *mutationResolver) DeletePatient(ctx context.Context, id int) (bool, error) {
	if err := r.PatientRepository.Delete(id); err != nil {
		return false, err
	}

	r.Redis.Publish(ctx, "patients-delete", id)

	return true, nil
}

func (r *queryResolver) Patient(ctx context.Context, id int) (*models.Patient, error) {
	var patient models.Patient

	if err := r.PatientRepository.Get(&patient, id); err != nil {
		return nil, err
	}

	return &patient, nil
}

func (r *queryResolver) SearchPatients(ctx context.Context, term string) ([]*models.Patient, error) {
	patients, err := r.PatientRepository.Search(term)
	if err != nil {
		return nil, err
	}

	return patients, nil
}

func (r *queryResolver) GetByCardNo(ctx context.Context, cardNo string) (*models.Patient, error) {
	var patient models.Patient
	if err := r.PatientRepository.FindByCardNo(&patient, cardNo); err != nil {
		return nil, err
	}

	return &patient, nil
}

func (r *queryResolver) GetProgressNotes(ctx context.Context, appointmentID int) (*graph_models.ProgressNote, error) {
	patientHistory, appointments, err := r.PatientRepository.GetAllProgressNotes(appointmentID)
	if err != nil {
		return nil, err
	}

	return &graph_models.ProgressNote{
		PatientHistory: patientHistory,
		Appointments:   appointments,
	}, nil
}

func (r *queryResolver) GetAllPatientProgress(ctx context.Context, patientID int) (*graph_models.ProgressNote, error) {
	patientHistory, appointments, err := r.PatientRepository.GetAllProgress(patientID)
	if err != nil {
		return nil, err
	}

	return &graph_models.ProgressNote{
		PatientHistory: patientHistory,
		Appointments:   appointments,
	}, nil
}

func (r *queryResolver) GetVitalSignsProgress(ctx context.Context, patientID int) (*graph_models.VitalSignsProgress, error) {
	appointments, err := r.PatientRepository.GetVitalSignsProgress(patientID)
	if err != nil {
		return nil, err
	}

	return &graph_models.VitalSignsProgress{
		Appointments: appointments,
	}, nil
}

func (r *queryResolver) GetPatientDiagnosticProgress(ctx context.Context, patientID int, procedureTypeTitle string) ([]*models.Appointment, error) {
	appointments, err := r.PatientRepository.GetPatientDiagnosticProcedures(patientID, procedureTypeTitle)
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (r *queryResolver) GetPatientDiagnosticProcedureTitles(ctx context.Context, patientID int) ([]string, error) {
	return r.DiagnosticProcedureOrderRepository.GetPatientDiagnosticProcedureTitles(patientID)
}

func (r *queryResolver) Patients(ctx context.Context, page models.PaginationInput) (*graph_models.PatientConnection, error) {
	patients, count, err := r.PatientRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PatientEdge, len(patients))

	for i, entity := range patients {
		e := entity

		edges[i] = &graph_models.PatientEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(patients, count, page)
	return &graph_models.PatientConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) GetPatientOrderCount(ctx context.Context, patientID int) (*graph_models.OrdersCount, error) {
	diagnosticCount, err := r.DiagnosticProcedureOrderRepository.GetCount(&models.DiagnosticProcedureOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	labCount, err := r.LabOrderRepository.GetCount(&models.LabOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	surgeryCount, err := r.SurgicalOrderRepository.GetCount(&models.SurgicalOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	treatmentCount, err := r.TreatmentOrderRepository.GetCount(&models.TreatmentOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	followUpCount, err := r.FollowUpOrderRepository.GetCount(&models.FollowUpOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	referralCount, err := r.ReferralOrderRepository.GetCount(&models.ReferralOrder{PatientID: patientID}, nil, nil)
	if err != nil {
		return nil, err
	}

	return &graph_models.OrdersCount{
		DiagnosticProcedureOrders: int(diagnosticCount),
		LabOrders:                 int(labCount),
		SurgicalOrders:            int(surgeryCount),
		TreatmentOrders:           int(treatmentCount),
		FollowUpOrders:            int(followUpCount),
		ReferralOrders:            int(referralCount),
	}, nil
}

func (r *queryResolver) GetPatientFiles(ctx context.Context, patientID int) ([]*models.File, error) {
	files, err := r.PatientRepository.GetPatientFiles(patientID)
	return files, err
}

func (r *queryResolver) FindSimilarPatients(ctx context.Context, input graph_models.SimilarPatientsInput) (*graph_models.SimilarPatients, error) {
	byName, err := r.PatientRepository.FindByName(input.FirstName, input.LastName)
	if err != nil {
		return nil, err
	}

	byPhone, err := r.PatientRepository.FindByPhoneNo(input.PhoneNo)
	if err != nil {
		return nil, err
	}

	return &graph_models.SimilarPatients{
		ByName:  byName,
		ByPhone: byPhone,
	}, nil
}
