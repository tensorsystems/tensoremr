/*
	nolint

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

package graph

//go:generate go run -mod=mod github.com/99designs/gqlgen

import (
	"crypto/sha1"
	"encoding/base64"
	"io"
	"io/ioutil"
	"os"
	"strings"
	"time"

	"github.com/casbin/casbin/v2"
	"github.com/go-redis/redis/v8"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/conf"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/repository"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver ...
type Resolver struct {
	Config                             *conf.Configuration
	AccessControl                      *casbin.Enforcer
	AllergyRepository                  repository.AllergyRepository
	AmendmentRepository                repository.AmendmentRepository
	AppointmentQueueRepository         repository.AppointmentQueueRepository
	AppointmentStatusRepository        repository.AppointmentStatusRepository
	AppointmentRepository              repository.AppointmentRepository
	AutoRefractionRepository           repository.AutoRefractionRepository
	BillingRepository                  repository.BillingRepository
	ChatDeleteRepository               repository.ChatDeleteRepository
	ChatMemberRepository               repository.ChatMemberRepository
	ChatMessageRepository              repository.ChatMessageRepository
	ChatMuteRepository                 repository.ChatMuteRepository
	ChatUnreadRepository               repository.ChatUnreadRepository
	ChatRepository                     repository.ChatRepository
	ChiefComplaintTypeRepository       repository.ChiefComplaintTypeRepository
	ChiefComplaintRepository           repository.ChiefComplaintRepository
	CoverTestRepository                repository.CoverTestRepository
	DiagnosisRepository                repository.DiagnosisRepository
	DiagnosticProcedureRepository      repository.DiagnosticProcedureRepository
	DiagnosticProcedureOrderRepository repository.DiagnosticProcedureOrderRepository
	DiagnosticProcedureTypeRepository  repository.DiagnosticProcedureTypeRepository
	ExamCategoryRepository             repository.ExamCategoryRepository
	ExternalExamRepository             repository.ExternalExamRepository
	ExamFindingRepository              repository.ExamFindingRepository
	EyewearPrescriptionOrderRepository repository.EyewearPrescriptionOrderRepository
	EyewearPrescriptionRepository      repository.EyewearPrescriptionRepository
	EyewearShopRepository              repository.EyewearShopRepository
	FamilyIllnessRepository            repository.FamilyIllnessRepository
	FavoriteChiefComplaintRepository   repository.FavoriteChiefComplaintRepository
	FavoriteDiagnosisRepository        repository.FavoriteDiagnosisRepository
	FavoriteMedicationRepository       repository.FavoriteMedicationRepository
	FileRepository                     repository.FileRepository
	FollowUpOrderRepository            repository.FollowUpOrderRepository
	FollowUpRepository                 repository.FollowUpRepository
	FunduscopyRepository               repository.FunduscopyRepository
	HpiComponentTypeRepository         repository.HpiComponentTypeRepository
	HpiComponentRepository             repository.HpiComponentRepository
	IopRepository                      repository.IopRepository
	LabOrderRepository                 repository.LabOrderRepository
	LabTypeRepository                  repository.LabTypeRepository
	LabRepository                      repository.LabRepository
	LifestyleTypeRepository            repository.LifestyleTypeRepository
	LifestyleRepository                repository.LifestyleRepository
	MedicalPrescriptionOrderRepository repository.MedicalPrescriptionOrderRepository
	MedicalPrescriptionRepository      repository.MedicalPrescriptionRepository
	OcularMotilityRepository           repository.OcularMotilityRepository
	OpthalmologyExamRepository         repository.OpthalmologyExamRepository
	OpticDiscRepository                repository.OpticDiscRepository
	OrganizationDetailsRepository      repository.OrganizationDetailsRepository
	PastHospitalizationRepository      repository.PastHospitalizationRepository
	PastIllnessTypeRepository          repository.PastIllnessTypeRepository
	PastIllnessRepository              repository.PastIllnessRepository
	PastInjuryRepository               repository.PastInjuryRepository
	PastOptSurgeryRepository           repository.PastOptSurgeryRepository
	PastSurgeryRepository              repository.PastSurgeryRepository
	PatientChartRepository             repository.PatientChartRepository
	PatientDiagnosisRepository         repository.PatientDiagnosisRepository
	PatientEncounterLimitRepository    repository.PatientEncounterLimitRepository
	PatientHistoryRepository           repository.PatientHistoryRepository
	PatientQueueRepository             repository.PatientQueueRepository
	PatientRepository                  repository.PatientRepository
	PaymentWaiverRepository            repository.PaymentWaiverRepository
	PaymentRepository                  repository.PaymentRepository
	PharmacyRepository                 repository.PharmacyRepository
	PhysicalExamFindingRepository      repository.PhysicalExamFindingRepository
	PupilsRepository                   repository.PupilsRepository
	QueueDestinationRepository         repository.QueueDestinationRepository
	QueueSubscriptionRepository        repository.QueueSubscriptionRepository
	ReferralOrderRepository            repository.ReferralOrderRepository
	ReferralRepository                 repository.ReferralRepository
	ReviewOfSystemRepository           repository.ReviewOfSystemRepository
	RoomRepository                     repository.RoomRepository
	SlitLampExamRepository             repository.SlitLampExamRepository
	SupplyRepository                   repository.SupplyRepository
	SurgicalOrderRepository            repository.SurgicalOrderRepository
	SurgicalProcedureTypeRepository    repository.SurgicalProcedureTypeRepository
	SurgicalProcedureRepository        repository.SurgicalProcedureRepository
	SystemSymptomRepository            repository.SystemSymptomRepository
	SystemRepository                   repository.SystemRepository
	TreatmentOrderRepository           repository.TreatmentOrderRepository
	TreatmentTypeRepository            repository.TreatmentTypeRepository
	TreatmentRepository                repository.TreatmentRepository
	UserTypeRepository                 repository.UserTypeRepository
	UserRepository                     repository.UserRepository
	VisitTypeRepository                repository.VisitTypeRepository
	VisualAcuityRepository             repository.VisualAcuityRepository
	VitalSignsRepository               repository.VitalSignsRepository
	Redis                              *redis.Client
}

// WriteFile ...
func WriteFile(file io.Reader, fileName string) error {
	content, readErr := ioutil.ReadAll(file)
	if readErr != nil {
		return readErr
	}

	writeErr := ioutil.WriteFile("files/"+fileName, content, 0644)
	if writeErr != nil {
		return writeErr
	}

	return nil
}

// RenameFile ...
func RenameFile(originalName string, newName string) error {
	return os.Rename("files/"+originalName, "files/"+newName)
}

// HashFileName ...
func HashFileName(name string) (fileName string, hashedFileName string, hash string, ext string) {
	s := strings.Split(name, ".")
	toHash := s[0] + time.Now().String()

	h := sha1.New()
	h.Write([]byte(toHash))

	fileName = s[0]
	hash = base64.URLEncoding.EncodeToString(h.Sum(nil))
	hashedFileName = s[0] + "_" + hash
	ext = s[1]

	return
}
