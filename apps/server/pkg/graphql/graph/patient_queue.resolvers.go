package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/generated"
	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/datatypes"
)

func (r *mutationResolver) SubscribeQueue(ctx context.Context, userID int, patientQueueID int) (*models.QueueSubscription, error) {
	var entity models.QueueSubscription

	if err := r.QueueSubscriptionRepository.Subscribe(&entity, userID, patientQueueID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UnsubscribeQueue(ctx context.Context, userID int, patientQueueID int) (*models.QueueSubscription, error) {
	var entity models.QueueSubscription

	if err := r.QueueSubscriptionRepository.Unsubscribe(&entity, userID, patientQueueID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SavePatientQueue(ctx context.Context, input graph_models.PatientQueueInput) (*models.PatientQueue, error) {
	var entity models.PatientQueue
	entity.QueueName = input.QueueName
	entity.QueueType = input.QueueType

	queue := datatypes.JSON([]byte("[" + strings.Join(input.Queue, ", ") + "]"))
	entity.Queue = queue

	if err := r.PatientQueueRepository.GetByQueueName(&entity, input.QueueName); err != nil {
		if err := r.PatientQueueRepository.Save(&entity); err != nil {
			return nil, err
		}
	} else {
		if err := r.PatientQueueRepository.UpdateQueue(input.QueueName, queue); err != nil {
			return nil, err
		}
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteFromQueue(ctx context.Context, patientQueueID int, appointmentID int) (*models.PatientQueue, error) {
	var entity models.PatientQueue

	if err := r.PatientQueueRepository.DeleteFromQueue(&entity, patientQueueID, appointmentID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) CheckOutPatient(ctx context.Context, patientQueueID int, appointmentID int) (*models.PatientQueue, error) {
	var appointment models.Appointment

	if err := r.AppointmentRepository.Get(&appointment, appointmentID); err != nil {
		return nil, err
	}

	// Change appointment status to Checked Out
	var status models.AppointmentStatus
	if err := r.AppointmentStatusRepository.GetByTitle(&status, "Checked-Out"); err != nil {
		return nil, err
	}

	appointment.AppointmentStatusID = status.ID
	appointment.CheckedOutTime = time.Now()

	if err := r.AppointmentRepository.Update(&appointment); err != nil {
		return nil, err
	}

	var patientQueue models.PatientQueue

	if err := r.PatientQueueRepository.DeleteFromQueue(&patientQueue, patientQueueID, appointmentID); err != nil {
		return nil, err
	}

	return &patientQueue, nil
}

func (r *mutationResolver) PushPatientQueue(ctx context.Context, patientQueueID int, appointmentID int, destination graph_models.Destination) (*models.PatientQueue, error) {
	var entity models.PatientQueue

	if destination.String() == "PREEXAM" {
		if err := r.PatientQueueRepository.MoveToQueueName(patientQueueID, "Pre-Exam", appointmentID, ""); err != nil {
			return nil, err
		}
	} else if destination.String() == "PREOPERATION" {
		if err := r.PatientQueueRepository.MoveToQueueName(patientQueueID, "Pre-Operation", appointmentID, ""); err != nil {
			return nil, err
		}
	} else if destination.String() == "PHYSICIAN" {
		var appointment models.Appointment
		if err := r.AppointmentRepository.Get(&appointment, appointmentID); err != nil {
			return nil, err
		}

		var provider models.User
		if err := r.UserRepository.Get(&provider, appointment.UserID); err != nil {
			return nil, err
		}

		if err := r.PatientQueueRepository.MoveToQueueName(patientQueueID, "Dr. "+provider.FirstName+" "+provider.LastName, appointmentID, "USER"); err != nil {
			return nil, err
		}
	}

	return &entity, nil
}

func (r *mutationResolver) MovePatientQueue(ctx context.Context, appointmentID int, sourceQueueID int, destinationQueueID int) (*models.PatientQueue, error) {
	var entity models.PatientQueue

	if err := r.PatientQueueRepository.Move(&entity, sourceQueueID, destinationQueueID, appointmentID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) CheckInPatient(ctx context.Context, appointmentID int, destination graph_models.Destination) (*models.Appointment, error) {
	var appointment models.Appointment

	if err := r.AppointmentRepository.Get(&appointment, appointmentID); err != nil {
		return nil, err
	}

	// Change appointment status to Checked In
	var status models.AppointmentStatus
	if err := r.AppointmentStatusRepository.GetByTitle(&status, "Checked-In"); err != nil {
		return nil, err
	}

	var visitType models.VisitType
	if err := r.VisitTypeRepository.Get(&visitType, appointment.VisitTypeID); err != nil {
		return nil, err
	}

	if visitType.Title == "Surgery" {
		var postOpAppointent models.Appointment

		if err := r.AppointmentRepository.SchedulePostOp(&postOpAppointent, appointment); err != nil {
			return nil, err
		}

	}

	appointment.AppointmentStatusID = status.ID
	checkedInTime := time.Now()
	appointment.CheckedInTime = &checkedInTime

	if err := r.AppointmentRepository.Update(&appointment); err != nil {
		return nil, err
	}

	// Add to queue
	var patientQueue models.PatientQueue
	if destination.String() == "PREEXAM" {
		if err := r.PatientQueueRepository.AddToQueue(&patientQueue, "Pre-Exam", appointmentID, "PREEXAM"); err != nil {
			return nil, err
		}

	} else if destination.String() == "PREOPERATION" {
		if err := r.PatientQueueRepository.AddToQueue(&patientQueue, "Pre-Operation", appointmentID, "PREOPERATION"); err != nil {
			return nil, err
		}
	} else if destination.String() == "PHYSICIAN" {
		var provider models.User
		if err := r.UserRepository.Get(&provider, appointment.UserID); err != nil {
			return nil, err
		}

		if err := r.PatientQueueRepository.AddToQueue(&patientQueue, "Dr. "+provider.FirstName+" "+provider.LastName, appointmentID, "USER"); err != nil {
			return nil, err
		}
	}

	return &appointment, nil
}

func (r *mutationResolver) UpdatePatientQueue(ctx context.Context, appointmentID int, destination *graph_models.Destination) (*models.PatientQueue, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *patientQueueResolver) Queue(ctx context.Context, obj *models.PatientQueue) (string, error) {
	return obj.Queue.String(), nil
}

func (r *queryResolver) PatientQueues(ctx context.Context) ([]*graph_models.PatientQueueWithAppointment, error) {
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

	isPhysician := false
	for _, e := range user.UserTypes {
		if e.Title == "Physician" {
			isPhysician = true
		}
	}

	var patientQueues []*models.PatientQueue

	if !isPhysician {
		p, err := r.PatientQueueRepository.GetAll()
		if err != nil {
			return nil, err
		}

		patientQueues = p
	} else {
		p, err := r.PatientQueueRepository.GetAll()
		if err != nil {
			return nil, err
		}

		var t []*models.PatientQueue

		for _, patientQueue := range p {
			if patientQueue.QueueType == models.UserQueue && patientQueue.QueueName != "Dr. "+user.FirstName+" "+user.LastName {
				continue
			}

			t = append(t, patientQueue)
		}

		patientQueues = t
	}

	var result []*graph_models.PatientQueueWithAppointment

	for _, patientQueue := range patientQueues {
		var ids []int

		if err := json.Unmarshal([]byte(patientQueue.Queue.String()), &ids); err != nil {
			return nil, err
		}

		page := models.PaginationInput{Page: 0, Size: 1000}

		appointments, _, _ := r.AppointmentRepository.GetByIds(ids, page)
		var orderedAppointments []*models.Appointment

		for _, id := range ids {
			for _, appointment := range appointments {
				if appointment.ID == id {
					a := appointment
					orderedAppointments = append(orderedAppointments, &a)
				}
			}
		}

		result = append(result, &graph_models.PatientQueueWithAppointment{
			ID:        int(patientQueue.ID),
			QueueName: patientQueue.QueueName,
			QueueType: patientQueue.QueueType,
			Queue:     orderedAppointments,
		})
	}

	return result, err
}

func (r *queryResolver) UserSubscriptions(ctx context.Context, userID int) (*models.QueueSubscription, error) {
	var entity models.QueueSubscription

	if err := r.QueueSubscriptionRepository.GetByUserId(&entity, userID); err != nil {
		return nil, err
	}

	return &entity, nil
}

// PatientQueue returns generated.PatientQueueResolver implementation.
func (r *Resolver) PatientQueue() generated.PatientQueueResolver { return &patientQueueResolver{r} }

type patientQueueResolver struct{ *Resolver }
