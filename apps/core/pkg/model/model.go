package model

type User struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	NamePrefix  string `json:"namePrefix"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	PhoneNumber string `json:"phoneNumber"`
	TimeJoined  uint64 `json:"timeJoined"`
}
