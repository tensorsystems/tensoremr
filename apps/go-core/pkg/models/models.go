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

package models

import (
	"errors"
	"fmt"
	"os"
	"reflect"
	"strings"

	"github.com/casbin/casbin/v2"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/conf"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Audit struct {
	CreatedByID int  `json:"createdById"`
	UpdatedByID *int `json:"updatedById"`
}

// Model facilitate database interactions
type Model struct {
	models map[string]reflect.Value
	isOpen bool
	*gorm.DB
	*casbin.Enforcer
}

// NewModel returns a new Model without opening database connection
func NewModel() *Model {
	return &Model{
		models: make(map[string]reflect.Value),
	}
}

// IsOpen returns true if the Model has already established connection
// to the database
func (m *Model) IsOpen() bool {
	return m.isOpen
}

// OpenPostgres ...
func (m *Model) OpenPostgres() error {
	dbHost := os.Getenv("DB_HOST")
	// dbReplicationHost := os.Getenv("DB_REPLICATION_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable TimeZone=UTC password=%s", dbHost, dbPort, dbUser, dbName, dbPassword)
	db, err := gorm.Open(postgres.Open(DBURL), &gorm.Config{})

	if err != nil {
		return err
	}

	m.DB = db
	m.isOpen = true

	return nil
}

// OpenWithConfigTest opens database connection with test database
func (m *Model) OpenWithConfigTest(cfg *conf.Configuration) error {
	dbHost := os.Getenv("TEST_DB_HOST")
	dbUser := os.Getenv("TEST_DB_USER")
	dbPassword := os.Getenv("TEST_DB_PASSWORD")
	dbName := os.Getenv("TEST_DB_NAME")
	dbPort := os.Getenv("TEST_DB_PORT")

	DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable TimeZone=UTC password=%s", dbHost, dbPort, dbUser, dbName, dbPassword)
	db, err := gorm.Open(postgres.Open(DBURL), &gorm.Config{})

	if err != nil {
		return err
	}

	m.DB = db
	m.isOpen = true

	return nil
}

// Register adds the values to the models registry
func (m *Model) Register(values ...interface{}) error {

	// do not work on them.models first, this is like an insurance policy
	// whenever we encounter any error in the values nothing goes into the registry
	models := make(map[string]reflect.Value)
	if len(values) > 0 {
		for _, val := range values {
			rVal := reflect.ValueOf(val)
			if rVal.Kind() == reflect.Ptr {
				rVal = rVal.Elem()
			}
			switch rVal.Kind() {
			case reflect.Struct:
				models[getTypeName(rVal.Type())] = reflect.New(rVal.Type())
			default:
				return errors.New("models must be structs")
			}
		}
	}
	for k, v := range models {
		m.models[k] = v
	}
	return nil
}

// AutoMigrateAll runs migrations for all the registered models
func (m *Model) AutoMigrateAll() {
	for _, v := range m.models {
		m.AutoMigrate(v.Interface())
	}
}

// DropAll drops all tables
func (m *Model) DropAll() {
	for _, v := range m.models {
		m.Migrator().DropTable(v.Interface())
	}
}

// RegisterAllModels ...
func (m *Model) RegisterAllModels() {
	m.Register(AppointmentStatus{})
	m.Register(Appointment{})
	m.Register(Billing{})
	m.Register(ChiefComplaint{})
	m.Register(PatientDiagnosis{})
	m.Register(DiagnosticProcedure{})
	m.Register(EyewearPrescription{})
	m.Register(FamilyIllness{})
	m.Register(File{})
	m.Register(Funduscopy{})
	m.Register(HpiComponentType{})
	m.Register(HpiComponent{})
	m.Register(Lab{})
	m.Register(Lifestyle{})
	m.Register(MedicalPrescription{})
	m.Register(PastSurgery{})
	m.Register(PastHospitalization{})
	m.Register(PastIllness{})
	m.Register(PastInjury{})
	m.Register(PastOptSurgery{})
	m.Register(PatientChart{})
	m.Register(PatientHistory{})
	m.Register(Patient{})
	m.Register(Payment{})
	m.Register(Pupils{})
	m.Register(Room{})
	m.Register(SurgicalProcedure{})
	m.Register(Treatment{})
	m.Register(UserType{})
	m.Register(User{})
	m.Register(VisitType{})
	m.Register(AppointmentQueue{})
	m.Register(QueueDestination{})
	m.Register(PastIllnessType{})
	m.Register(LifestyleType{})
	m.Register(ChiefComplaintType{})
	m.Register(Diagnosis{})
	m.Register(DiagnosticProcedureType{})
	m.Register(FavoriteMedication{})
	m.Register(SurgicalProcedureType{})
	m.Register(Supply{})
	m.Register(TreatmentType{})
	m.Register(LabType{})
	m.Register(ChatDelete{})
	m.Register(ChatMember{})
	m.Register(ChatMessage{})
	m.Register(ChatMute{})
	m.Register(ChatUnreadMessage{})
	m.Register(Chat{})
	m.Register(Allergy{})
	m.Register(Referral{})
	m.Register(FavoriteChiefComplaint{})
	m.Register(FavoriteDiagnosis{})
	m.Register(PaymentWaiver{})
	m.Register(PatientEncounterLimit{})
	m.Register(Pharmacy{})
	m.Register(EyewearShop{})
	m.Register(MedicalPrescriptionOrder{})
	m.Register(EyewearPrescriptionOrder{})
	m.Register(MedicalPrescriptionOrder{})
	m.Register(DiagnosticProcedureOrder{})
	m.Register(LabOrder{})
	m.Register(Amendment{})
	m.Register(OrganizationDetails{})
	m.Register(System{})
	m.Register(SystemSymptom{})
	m.Register(ReviewOfSystem{})
	m.Register(ExamCategory{})
	m.Register(ExamFinding{})
	m.Register(PhysicalExamFinding{})
	m.Register(PatientQueue{})
	m.Register(QueueSubscription{})
	m.Register(OpthalmologyExam{})
	m.Register(VitalSigns{})
	m.Register(SurgicalOrder{})
	m.Register(TreatmentOrder{})
	m.Register(FollowUp{})
	m.Register(FollowUpOrder{})
	m.Register(ReferralOrder{})
	m.Register(Modality{})
	m.Register(ClinicalFinding{})
	m.Register(ClinicalFindingAttribute{})
}

func getTypeName(typ reflect.Type) string {
	if typ.Name() != "" {
		return typ.Name()
	}
	split := strings.Split(typ.String(), ".")
	return split[len(split)-1]
}

// AddSearchIndex ...
func (s *Model) AddSearchIndex() error {
	d := s.DB

	if err := d.Exec("UPDATE patients SET document = to_tsvector(id || ' ' || first_name || ' ' || last_name || ' ' || phone_no || ' ' || phone_no2 || ' ' || coalesce(email, ''))").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX patients_document_idx ON patients USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION patients_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.id || ' ' || new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.phone_no2 || ' ' || coalesce(new.email, ''));
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE patients_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// users search index
	// =======================

	if err := d.Exec("UPDATE users SET document = to_tsvector(id || ' ' || first_name || ' ' || last_name || ' ' || coalesce(email, ''))").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX users_document_idx ON users USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION users_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.id || ' ' || new.first_name || ' ' || new.last_name || ' ' || coalesce(new.email, ''));
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE users_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// billings search index
	// =======================

	if err := d.Exec("UPDATE billings SET document = to_tsvector(id || ' ' || item || ' ' || code)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX billings_document_idx ON billings USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION billings_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.id || ' ' || new.item || ' ' || new.code);
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON billings FOR EACH ROW EXECUTE PROCEDURE billings_tsvector_trigger()").Error; err != nil {

	}

	// ============================
	// appointments search index
	// ============================

	if err := d.Exec("UPDATE appointments SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX appointments_document_idx ON appointments USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION appointments_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no);
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE appointments_tsvector_trigger()").Error; err != nil {

	}

	// ========================================
	// diagnostic procedure order search index
	// ========================================

	if err := d.Exec("UPDATE diagnostic_procedure_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX diagnostic_procedure_orders_document_idx ON diagnostic_procedure_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION diagnostic_procedure_orders_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON diagnostic_procedure_orders FOR EACH ROW EXECUTE PROCEDURE diagnostic_procedure_orders_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// lab order search index
	// =======================
	if err := d.Exec("UPDATE lab_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX lab_orders_document_idx ON lab_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION lab_orders_tsvector_trigger() RETURNS trigger AS $$
		begin
			new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
			return new;
		end
		$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON lab_orders FOR EACH ROW EXECUTE PROCEDURE lab_orders_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// diagnosis search index
	// =======================
	if err := d.Exec("UPDATE diagnoses SET document = to_tsvector(id || ' ' || coalesce(category_code, '') || ' ' || coalesce(diagnosis_code, '') || ' ' || coalesce(full_code, '') || ' ' || coalesce(full_description, '') || ' ' || coalesce(category_title, ''))").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX diagnoses_document_idx ON diagnoses USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION diagnoses_tsvector_trigger() RETURNS trigger AS $$
	begin
		new.document := to_tsvector(new.id || ' ' || coalesce(new.category_code, '') || ' ' || coalesce(new.diagnosis_code, '') || ' ' || coalesce(new.full_code, '') || ' ' || coalesce(new.full_description, '') || ' ' || coalesce(new.category_title, ''));
		return new;
	end
	$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON diagnoses FOR EACH ROW EXECUTE PROCEDURE diagnoses_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// treatment order search index
	// =======================

	if err := d.Exec("UPDATE treatment_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX treatment_orders_document_idx ON treatment_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION treatment_orders_tsvector_trigger() RETURNS trigger AS $$
		begin
			new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
			return new;
		end
		$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON treatment_orders FOR EACH ROW EXECUTE PROCEDURE treatment_orders_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// surgical order search index
	// =======================

	if err := d.Exec("UPDATE surgical_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX surgical_orders_document_idx ON surgical_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION surgical_orders_tsvector_trigger() RETURNS trigger AS $$
		begin
			new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
			return new;
		end
		$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON surgical_orders FOR EACH ROW EXECUTE PROCEDURE surgical_orders_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// follow up search index
	// =======================

	if err := d.Exec("UPDATE follow_up_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX follow_up_orders_document_idx ON follow_up_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION follow_up_orders_tsvector_trigger() RETURNS trigger AS $$
		begin
			new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
			return new;
		end
		$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON follow_up_orders FOR EACH ROW EXECUTE PROCEDURE follow_up_orders_tsvector_trigger()").Error; err != nil {

	}

	// =======================
	// referral search index
	// =======================
	if err := d.Exec("UPDATE referral_orders SET document = to_tsvector(first_name || ' ' || last_name || ' ' || phone_no || ' ' || user_name)").Error; err != nil {

	}

	if err := d.Exec("CREATE INDEX referral_orders_document_idx ON referral_orders USING GIN (document)").Error; err != nil {

	}

	if err := d.Exec(`CREATE FUNCTION referral_orders_tsvector_trigger() RETURNS trigger AS $$
		begin
			new.document := to_tsvector(new.first_name || ' ' || new.last_name || ' ' || new.phone_no || ' ' || new.user_name);
			return new;
		end
		$$ LANGUAGE plpgsql`).Error; err != nil {

	}

	if err := d.Exec("CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON referral_orders FOR EACH ROW EXECUTE PROCEDURE referral_orders_tsvector_trigger()").Error; err != nil {

	}

	return nil
}
