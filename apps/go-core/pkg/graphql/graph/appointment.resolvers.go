package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) NewAppointment(ctx context.Context, input graph_models.AppointmentInput) (*models.Appointment, error) {
	var appointment models.Appointment
	deepCopy.Copy(&input).To(&appointment)

	if err := r.AppointmentRepository.CreateNewAppointment(&appointment, input.BillingID, input.InvoiceNo); err != nil {
		return nil, err
	}


	return &appointment, nil
}

func (r *mutationResolver) UpdateAppointment(ctx context.Context, input graph_models.AppointmentUpdateInput) (*models.Appointment, error) {
	var appointment models.Appointment
	appointment.ID = input.ID

	var existing models.Appointment
	if err := r.AppointmentRepository.Get(&existing, input.ID); err != nil {
		return nil, err
	}

	if input.PatientID != nil {
		appointment.PatientID = *input.PatientID
	}

	if input.CheckInTime != nil {
		appointment.CheckInTime = *input.CheckInTime
	}

	if input.CheckedInTime != nil {
		appointment.CheckedInTime = input.CheckedInTime
	}

	if input.CheckedOutTime != nil {
		appointment.CheckedOutTime = *input.CheckedOutTime
	}

	if input.RoomID != nil {
		appointment.RoomID = *input.RoomID
	}

	if input.VisitTypeID != nil {
		appointment.VisitTypeID = *input.VisitTypeID
	}

	if input.AppointmentStatusID != nil {
		appointment.AppointmentStatusID = *input.AppointmentStatusID
	}

	if input.Emergency != nil {
		appointment.Emergency = input.Emergency
	}

	if input.MedicalDepartment != nil {
		appointment.MedicalDepartment = *input.MedicalDepartment
	}

	if input.Credit != nil {
		appointment.Credit = *input.Credit
	}

	if input.ProviderName != nil {
		appointment.ProviderName = *input.ProviderName
	}

	if existing.UserID != *input.UserID {
		var user models.User
		if err := r.UserRepository.Get(&user, *input.UserID); err != nil {
			return nil, err
		}

		providerName := user.FirstName + " " + user.LastName
		appointment.ProviderName = providerName
		appointment.UserID = user.ID
	}

	if err := r.AppointmentRepository.Update(&appointment); err != nil {
		return nil, err
	}


	return &appointment, nil
}

func (r *mutationResolver) DeleteAppointment(ctx context.Context, id int) (bool, error) {
	if err := r.AppointmentRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) SaveAppointmentStatus(ctx context.Context, input graph_models.AppointmentStatusInput) (*models.AppointmentStatus, error) {
	var entity models.AppointmentStatus
	deepCopy.Copy(&input).To(&entity)

	if err := r.AppointmentStatusRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateAppointmentStatus(ctx context.Context, input graph_models.AppointmentStatusInput, id int) (*models.AppointmentStatus, error) {
	var entity models.AppointmentStatus
	deepCopy.Copy(&input).To(&entity)

	entity.ID = id

	if err := r.AppointmentStatusRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteAppointmentStatus(ctx context.Context, id int) (bool, error) {
	if err := r.AppointmentStatusRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Appointment(ctx context.Context, id int) (*models.Appointment, error) {
	var appointment models.Appointment
	if err := r.AppointmentRepository.GetWithDetails(&appointment, id); err != nil {
		return nil, err
	}

	var history models.PatientHistory
	if err := r.PatientHistoryRepository.GetByPatientID(&history, appointment.Patient.ID); err != nil {
		return nil, err
	}

	appointment.Patient.PatientHistory = history

	return &appointment, nil
}

func (r *queryResolver) Appointments(ctx context.Context, page models.PaginationInput, filter *graph_models.AppointmentFilter) (*graph_models.AppointmentConnection, error) {
	var f models.Appointment
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	appointments, count, err := r.AppointmentRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AppointmentEdge, len(appointments))

	for i, entity := range appointments {
		e := entity

		edges[i] = &graph_models.AppointmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(appointments, count, page)
	return &graph_models.AppointmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) AppointmentStatuses(ctx context.Context, page models.PaginationInput) (*graph_models.AppointmentStatusConnection, error) {
	entities, count, err := r.AppointmentStatusRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AppointmentStatusEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.AppointmentStatusEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.AppointmentStatusConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) FindAppointmentsByPatientAndRange(ctx context.Context, patientID int, start time.Time, end time.Time) ([]*models.Appointment, error) {
	entities, err := r.AppointmentRepository.FindAppointmentsByPatientAndRange(patientID, start, end)

	if err != nil {
		return entities, err
	}

	return entities, err
}

func (r *queryResolver) PatientsAppointmentToday(ctx context.Context, patientID int, checkedIn bool, paid *bool) (*models.Appointment, error) {
	appointment, _ := r.AppointmentRepository.PatientsAppointmentToday(patientID, &checkedIn, paid)
	return &appointment, nil
}

func (r *queryResolver) FindTodaysAppointments(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.AppointmentConnection, error) {
	appointments, count, err := r.AppointmentRepository.FindTodaysAppointments(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AppointmentEdge, len(appointments))

	for i, entity := range appointments {
		e := entity

		edges[i] = &graph_models.AppointmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(appointments, count, page)
	return &graph_models.AppointmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) FindTodaysCheckedInAppointments(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.AppointmentConnection, error) {
	appointments, count, err := r.AppointmentRepository.FindTodaysCheckedInAppointments(page, searchTerm, []string{})
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AppointmentEdge, len(appointments))

	for i, entity := range appointments {
		e := entity

		edges[i] = &graph_models.AppointmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(appointments, count, page)
	return &graph_models.AppointmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchAppointments(ctx context.Context, page models.PaginationInput, input models.AppointmentSearchInput) (*graph_models.AppointmentConnection, error) {
	appointments, count, err := r.AppointmentRepository.SearchAppointments(page, input)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AppointmentEdge, len(appointments))

	for i, entity := range appointments {
		e := entity

		edges[i] = &graph_models.AppointmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(appointments, count, page)
	return &graph_models.AppointmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) GetUserAppointments(ctx context.Context, page models.PaginationInput, searchTerm *string, visitType *string, subscriptions *bool) (*graph_models.AppointmentConnection, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	var user models.User

	if err := r.UserRepository.GetByEmail(&user, email); err != nil {
		return nil, err
	}

	var appointments []models.Appointment
	var count int64
	var aErr error

	isPhysician := false
	for _, e := range user.UserTypes {
		if e.Title == "Physician" {
			isPhysician = true
		}
	}

	var visitTypes []string

	if visitType != nil {
		if *visitType == "Outpatient" {
			visitTypes = append(visitTypes, "Sick Visit", "Follow-Up", "Check-Up", "Referral")
		} else if *visitType == "Surgeries" {
			visitTypes = append(visitTypes, "Surgery")
		} else if *visitType == "Treatments" {
			visitTypes = append(visitTypes, "Treatment")
		} else if *visitType == "Post-Ops" {
			visitTypes = append(visitTypes, "Post-Op")
		}
	}

	if *subscriptions {
		var queueSubscription models.QueueSubscription

		if err := r.QueueSubscriptionRepository.GetByUserId(&queueSubscription, user.ID); err != nil {
			return nil, err
		}

		patientQueues := queueSubscription.Subscriptions

		for _, patientQueue := range patientQueues {
			var ids []int

			if err := json.Unmarshal([]byte(patientQueue.Queue.String()), &ids); err != nil {
				return nil, err
			}

			a, c, e := r.AppointmentRepository.FindByUserSubscriptions(ids, searchTerm, visitTypes, page)

			var orderedAppointments []models.Appointment
			for _, appointment := range a {
				aTemp := appointment

				aTemp.QueueName = patientQueue.QueueName
				aTemp.QueueID = patientQueue.ID
				orderedAppointments = append(orderedAppointments, aTemp)
			}

			appointments = append(appointments, orderedAppointments...)
			count += c
			aErr = e
		}
	} else {
		if isPhysician {
			appointments, count, aErr = r.AppointmentRepository.FindByProvider(page, searchTerm, visitTypes, user.ID)
			if aErr != nil {
				return nil, aErr
			}
		} else {
			appointments, count, aErr = r.AppointmentRepository.FindTodaysCheckedInAppointments(page, searchTerm, visitTypes)
			if aErr != nil {
				return nil, aErr
			}
		}
	}

	edges := make([]*graph_models.AppointmentEdge, len(appointments))

	for i, entity := range appointments {
		e := entity

		edges[i] = &graph_models.AppointmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(appointments, count, page)
	return &graph_models.AppointmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PayForConsultation(ctx context.Context, patientID int, date *time.Time) (bool, error) {
	shouldPay, err := r.AppointmentRepository.PayForConsultation(patientID, date)
	return shouldPay, err
}
