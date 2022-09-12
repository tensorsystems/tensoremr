// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.21.5
// source: pkg/terminology/terminology.proto

package terminology

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type EmptyRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *EmptyRequest) Reset() {
	*x = EmptyRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EmptyRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EmptyRequest) ProtoMessage() {}

func (x *EmptyRequest) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EmptyRequest.ProtoReflect.Descriptor instead.
func (*EmptyRequest) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{0}
}

type ConceptRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ConceptId string `protobuf:"bytes,1,opt,name=conceptId,proto3" json:"conceptId,omitempty"`
}

func (x *ConceptRequest) Reset() {
	*x = ConceptRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptRequest) ProtoMessage() {}

func (x *ConceptRequest) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptRequest.ProtoReflect.Descriptor instead.
func (*ConceptRequest) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{1}
}

func (x *ConceptRequest) GetConceptId() string {
	if x != nil {
		return x.ConceptId
	}
	return ""
}

type ConceptResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Concept *Concept `protobuf:"bytes,1,opt,name=concept,proto3" json:"concept,omitempty"`
}

func (x *ConceptResponse) Reset() {
	*x = ConceptResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptResponse) ProtoMessage() {}

func (x *ConceptResponse) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptResponse.ProtoReflect.Descriptor instead.
func (*ConceptResponse) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{2}
}

func (x *ConceptResponse) GetConcept() *Concept {
	if x != nil {
		return x.Concept
	}
	return nil
}

type LookupRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Size       int64  `protobuf:"varint,1,opt,name=size,proto3" json:"size,omitempty"`
	SearchTerm string `protobuf:"bytes,2,opt,name=searchTerm,proto3" json:"searchTerm,omitempty"`
}

func (x *LookupRequest) Reset() {
	*x = LookupRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *LookupRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*LookupRequest) ProtoMessage() {}

func (x *LookupRequest) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use LookupRequest.ProtoReflect.Descriptor instead.
func (*LookupRequest) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{3}
}

func (x *LookupRequest) GetSize() int64 {
	if x != nil {
		return x.Size
	}
	return 0
}

func (x *LookupRequest) GetSearchTerm() string {
	if x != nil {
		return x.SearchTerm
	}
	return ""
}

type Concept struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id                 string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	CaseSignificanceId string `protobuf:"bytes,2,opt,name=caseSignificanceId,proto3" json:"caseSignificanceId,omitempty"`
	Nodetype           string `protobuf:"bytes,3,opt,name=nodetype,proto3" json:"nodetype,omitempty"`
	AcceptabilityId    string `protobuf:"bytes,4,opt,name=acceptabilityId,proto3" json:"acceptabilityId,omitempty"`
	RefsetId           string `protobuf:"bytes,5,opt,name=refsetId,proto3" json:"refsetId,omitempty"`
	LanguageCode       string `protobuf:"bytes,6,opt,name=languageCode,proto3" json:"languageCode,omitempty"`
	DescriptionType    string `protobuf:"bytes,7,opt,name=descriptionType,proto3" json:"descriptionType,omitempty"`
	Term               string `protobuf:"bytes,8,opt,name=term,proto3" json:"term,omitempty"`
	TypeId             string `protobuf:"bytes,9,opt,name=typeId,proto3" json:"typeId,omitempty"`
	ModuleId           string `protobuf:"bytes,10,opt,name=moduleId,proto3" json:"moduleId,omitempty"`
	Sctid              string `protobuf:"bytes,11,opt,name=sctid,proto3" json:"sctid,omitempty"`
	FSN                string `protobuf:"bytes,12,opt,name=FSN,proto3" json:"FSN,omitempty"`
}

func (x *Concept) Reset() {
	*x = Concept{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Concept) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Concept) ProtoMessage() {}

func (x *Concept) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Concept.ProtoReflect.Descriptor instead.
func (*Concept) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{4}
}

func (x *Concept) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Concept) GetCaseSignificanceId() string {
	if x != nil {
		return x.CaseSignificanceId
	}
	return ""
}

func (x *Concept) GetNodetype() string {
	if x != nil {
		return x.Nodetype
	}
	return ""
}

func (x *Concept) GetAcceptabilityId() string {
	if x != nil {
		return x.AcceptabilityId
	}
	return ""
}

func (x *Concept) GetRefsetId() string {
	if x != nil {
		return x.RefsetId
	}
	return ""
}

func (x *Concept) GetLanguageCode() string {
	if x != nil {
		return x.LanguageCode
	}
	return ""
}

func (x *Concept) GetDescriptionType() string {
	if x != nil {
		return x.DescriptionType
	}
	return ""
}

func (x *Concept) GetTerm() string {
	if x != nil {
		return x.Term
	}
	return ""
}

func (x *Concept) GetTypeId() string {
	if x != nil {
		return x.TypeId
	}
	return ""
}

func (x *Concept) GetModuleId() string {
	if x != nil {
		return x.ModuleId
	}
	return ""
}

func (x *Concept) GetSctid() string {
	if x != nil {
		return x.Sctid
	}
	return ""
}

func (x *Concept) GetFSN() string {
	if x != nil {
		return x.FSN
	}
	return ""
}

type ConceptsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Items []*Concept `protobuf:"bytes,1,rep,name=items,proto3" json:"items,omitempty"`
	Total int64      `protobuf:"varint,2,opt,name=total,proto3" json:"total,omitempty"`
}

func (x *ConceptsResponse) Reset() {
	*x = ConceptsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptsResponse) ProtoMessage() {}

func (x *ConceptsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptsResponse.ProtoReflect.Descriptor instead.
func (*ConceptsResponse) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{5}
}

func (x *ConceptsResponse) GetItems() []*Concept {
	if x != nil {
		return x.Items
	}
	return nil
}

func (x *ConceptsResponse) GetTotal() int64 {
	if x != nil {
		return x.Total
	}
	return 0
}

type ConceptAttributesRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ConceptId string `protobuf:"bytes,1,opt,name=conceptId,proto3" json:"conceptId,omitempty"`
}

func (x *ConceptAttributesRequest) Reset() {
	*x = ConceptAttributesRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptAttributesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptAttributesRequest) ProtoMessage() {}

func (x *ConceptAttributesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptAttributesRequest.ProtoReflect.Descriptor instead.
func (*ConceptAttributesRequest) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{6}
}

func (x *ConceptAttributesRequest) GetConceptId() string {
	if x != nil {
		return x.ConceptId
	}
	return ""
}

type ConceptAttributes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Association        *Concept `protobuf:"bytes,1,opt,name=association,proto3" json:"association,omitempty"`
	RelationshipType   string   `protobuf:"bytes,2,opt,name=RelationshipType,proto3" json:"RelationshipType,omitempty"`
	RelationshipId     string   `protobuf:"bytes,3,opt,name=RelationshipId,proto3" json:"RelationshipId,omitempty"`
	RelationshipTypeId string   `protobuf:"bytes,4,opt,name=RelationshipTypeId,proto3" json:"RelationshipTypeId,omitempty"`
	Description        *Concept `protobuf:"bytes,5,opt,name=description,proto3" json:"description,omitempty"`
}

func (x *ConceptAttributes) Reset() {
	*x = ConceptAttributes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptAttributes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptAttributes) ProtoMessage() {}

func (x *ConceptAttributes) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptAttributes.ProtoReflect.Descriptor instead.
func (*ConceptAttributes) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{7}
}

func (x *ConceptAttributes) GetAssociation() *Concept {
	if x != nil {
		return x.Association
	}
	return nil
}

func (x *ConceptAttributes) GetRelationshipType() string {
	if x != nil {
		return x.RelationshipType
	}
	return ""
}

func (x *ConceptAttributes) GetRelationshipId() string {
	if x != nil {
		return x.RelationshipId
	}
	return ""
}

func (x *ConceptAttributes) GetRelationshipTypeId() string {
	if x != nil {
		return x.RelationshipTypeId
	}
	return ""
}

func (x *ConceptAttributes) GetDescription() *Concept {
	if x != nil {
		return x.Description
	}
	return nil
}

type ConceptAttributeResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Attributes []*ConceptAttributes `protobuf:"bytes,1,rep,name=attributes,proto3" json:"attributes,omitempty"`
}

func (x *ConceptAttributeResponse) Reset() {
	*x = ConceptAttributeResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_pkg_terminology_terminology_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ConceptAttributeResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ConceptAttributeResponse) ProtoMessage() {}

func (x *ConceptAttributeResponse) ProtoReflect() protoreflect.Message {
	mi := &file_pkg_terminology_terminology_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ConceptAttributeResponse.ProtoReflect.Descriptor instead.
func (*ConceptAttributeResponse) Descriptor() ([]byte, []int) {
	return file_pkg_terminology_terminology_proto_rawDescGZIP(), []int{8}
}

func (x *ConceptAttributeResponse) GetAttributes() []*ConceptAttributes {
	if x != nil {
		return x.Attributes
	}
	return nil
}

var File_pkg_terminology_terminology_proto protoreflect.FileDescriptor

var file_pkg_terminology_terminology_proto_rawDesc = []byte{
	0x0a, 0x21, 0x70, 0x6b, 0x67, 0x2f, 0x74, 0x65, 0x72, 0x6d, 0x69, 0x6e, 0x6f, 0x6c, 0x6f, 0x67,
	0x79, 0x2f, 0x74, 0x65, 0x72, 0x6d, 0x69, 0x6e, 0x6f, 0x6c, 0x6f, 0x67, 0x79, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x12, 0x04, 0x6d, 0x61, 0x69, 0x6e, 0x22, 0x0e, 0x0a, 0x0c, 0x45, 0x6d, 0x70,
	0x74, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x2e, 0x0a, 0x0e, 0x43, 0x6f, 0x6e,
	0x63, 0x65, 0x70, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x1c, 0x0a, 0x09, 0x63,
	0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09,
	0x63, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x49, 0x64, 0x22, 0x3a, 0x0a, 0x0f, 0x43, 0x6f, 0x6e,
	0x63, 0x65, 0x70, 0x74, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x27, 0x0a, 0x07,
	0x63, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e,
	0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x52, 0x07, 0x63, 0x6f,
	0x6e, 0x63, 0x65, 0x70, 0x74, 0x22, 0x43, 0x0a, 0x0d, 0x4c, 0x6f, 0x6f, 0x6b, 0x75, 0x70, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x73, 0x69, 0x7a, 0x65, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x03, 0x52, 0x04, 0x73, 0x69, 0x7a, 0x65, 0x12, 0x1e, 0x0a, 0x0a, 0x73, 0x65,
	0x61, 0x72, 0x63, 0x68, 0x54, 0x65, 0x72, 0x6d, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a,
	0x73, 0x65, 0x61, 0x72, 0x63, 0x68, 0x54, 0x65, 0x72, 0x6d, 0x22, 0xe9, 0x02, 0x0a, 0x07, 0x43,
	0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x2e, 0x0a, 0x12, 0x63, 0x61, 0x73, 0x65, 0x53, 0x69,
	0x67, 0x6e, 0x69, 0x66, 0x69, 0x63, 0x61, 0x6e, 0x63, 0x65, 0x49, 0x64, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x12, 0x63, 0x61, 0x73, 0x65, 0x53, 0x69, 0x67, 0x6e, 0x69, 0x66, 0x69, 0x63,
	0x61, 0x6e, 0x63, 0x65, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x6e, 0x6f, 0x64, 0x65, 0x74, 0x79,
	0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x6e, 0x6f, 0x64, 0x65, 0x74, 0x79,
	0x70, 0x65, 0x12, 0x28, 0x0a, 0x0f, 0x61, 0x63, 0x63, 0x65, 0x70, 0x74, 0x61, 0x62, 0x69, 0x6c,
	0x69, 0x74, 0x79, 0x49, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0f, 0x61, 0x63, 0x63,
	0x65, 0x70, 0x74, 0x61, 0x62, 0x69, 0x6c, 0x69, 0x74, 0x79, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08,
	0x72, 0x65, 0x66, 0x73, 0x65, 0x74, 0x49, 0x64, 0x18, 0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08,
	0x72, 0x65, 0x66, 0x73, 0x65, 0x74, 0x49, 0x64, 0x12, 0x22, 0x0a, 0x0c, 0x6c, 0x61, 0x6e, 0x67,
	0x75, 0x61, 0x67, 0x65, 0x43, 0x6f, 0x64, 0x65, 0x18, 0x06, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0c,
	0x6c, 0x61, 0x6e, 0x67, 0x75, 0x61, 0x67, 0x65, 0x43, 0x6f, 0x64, 0x65, 0x12, 0x28, 0x0a, 0x0f,
	0x64, 0x65, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x54, 0x79, 0x70, 0x65, 0x18,
	0x07, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0f, 0x64, 0x65, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69,
	0x6f, 0x6e, 0x54, 0x79, 0x70, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x65, 0x72, 0x6d, 0x18, 0x08,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x74, 0x65, 0x72, 0x6d, 0x12, 0x16, 0x0a, 0x06, 0x74, 0x79,
	0x70, 0x65, 0x49, 0x64, 0x18, 0x09, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x74, 0x79, 0x70, 0x65,
	0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x6d, 0x6f, 0x64, 0x75, 0x6c, 0x65, 0x49, 0x64, 0x18, 0x0a,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x6d, 0x6f, 0x64, 0x75, 0x6c, 0x65, 0x49, 0x64, 0x12, 0x14,
	0x0a, 0x05, 0x73, 0x63, 0x74, 0x69, 0x64, 0x18, 0x0b, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x73,
	0x63, 0x74, 0x69, 0x64, 0x12, 0x10, 0x0a, 0x03, 0x46, 0x53, 0x4e, 0x18, 0x0c, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x03, 0x46, 0x53, 0x4e, 0x22, 0x4d, 0x0a, 0x10, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70,
	0x74, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x23, 0x0a, 0x05, 0x69, 0x74,
	0x65, 0x6d, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6d, 0x61, 0x69, 0x6e,
	0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x52, 0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x12,
	0x14, 0x0a, 0x05, 0x74, 0x6f, 0x74, 0x61, 0x6c, 0x18, 0x02, 0x20, 0x01, 0x28, 0x03, 0x52, 0x05,
	0x74, 0x6f, 0x74, 0x61, 0x6c, 0x22, 0x38, 0x0a, 0x18, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74,
	0x41, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x12, 0x1c, 0x0a, 0x09, 0x63, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x49, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x63, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x49, 0x64, 0x22,
	0xf9, 0x01, 0x0a, 0x11, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41, 0x74, 0x74, 0x72, 0x69,
	0x62, 0x75, 0x74, 0x65, 0x73, 0x12, 0x2f, 0x0a, 0x0b, 0x61, 0x73, 0x73, 0x6f, 0x63, 0x69, 0x61,
	0x74, 0x69, 0x6f, 0x6e, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6d, 0x61, 0x69,
	0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x52, 0x0b, 0x61, 0x73, 0x73, 0x6f, 0x63,
	0x69, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x2a, 0x0a, 0x10, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69,
	0x6f, 0x6e, 0x73, 0x68, 0x69, 0x70, 0x54, 0x79, 0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x10, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x68, 0x69, 0x70, 0x54, 0x79,
	0x70, 0x65, 0x12, 0x26, 0x0a, 0x0e, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x68,
	0x69, 0x70, 0x49, 0x64, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0e, 0x52, 0x65, 0x6c, 0x61,
	0x74, 0x69, 0x6f, 0x6e, 0x73, 0x68, 0x69, 0x70, 0x49, 0x64, 0x12, 0x2e, 0x0a, 0x12, 0x52, 0x65,
	0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x68, 0x69, 0x70, 0x54, 0x79, 0x70, 0x65, 0x49, 0x64,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x12, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e,
	0x73, 0x68, 0x69, 0x70, 0x54, 0x79, 0x70, 0x65, 0x49, 0x64, 0x12, 0x2f, 0x0a, 0x0b, 0x64, 0x65,
	0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x0d, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x52, 0x0b,
	0x64, 0x65, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x22, 0x53, 0x0a, 0x18, 0x43,
	0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x37, 0x0a, 0x0a, 0x61, 0x74, 0x74, 0x72, 0x69,
	0x62, 0x75, 0x74, 0x65, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x17, 0x2e, 0x6d, 0x61,
	0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41, 0x74, 0x74, 0x72, 0x69, 0x62,
	0x75, 0x74, 0x65, 0x73, 0x52, 0x0a, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73,
	0x32, 0xaf, 0x01, 0x0a, 0x0b, 0x54, 0x65, 0x72, 0x6d, 0x69, 0x6e, 0x6f, 0x6c, 0x6f, 0x67, 0x79,
	0x12, 0x46, 0x0a, 0x15, 0x47, 0x65, 0x74, 0x48, 0x69, 0x73, 0x74, 0x6f, 0x72, 0x79, 0x4f, 0x66,
	0x44, 0x69, 0x73, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x73, 0x12, 0x13, 0x2e, 0x6d, 0x61, 0x69, 0x6e,
	0x2e, 0x4c, 0x6f, 0x6f, 0x6b, 0x75, 0x70, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x16,
	0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x12, 0x58, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x43,
	0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73,
	0x12, 0x1e, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41,
	0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x1e, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x43, 0x6f, 0x6e, 0x63, 0x65, 0x70, 0x74, 0x41,
	0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x22, 0x00, 0x42, 0x8a, 0x01, 0x0a, 0x2c, 0x6e, 0x65, 0x74, 0x2e, 0x74, 0x65, 0x6e, 0x73, 0x6f,
	0x72, 0x73, 0x79, 0x73, 0x74, 0x65, 0x6d, 0x73, 0x2e, 0x74, 0x65, 0x6e, 0x73, 0x6f, 0x72, 0x65,
	0x6d, 0x72, 0x2e, 0x74, 0x65, 0x72, 0x6d, 0x69, 0x6e, 0x6f, 0x6c, 0x6f, 0x67, 0x79, 0x2e, 0x67,
	0x72, 0x70, 0x63, 0x42, 0x19, 0x54, 0x65, 0x6e, 0x73, 0x6f, 0x72, 0x45, 0x4d, 0x52, 0x54, 0x65,
	0x72, 0x6d, 0x6f, 0x6e, 0x6f, 0x6c, 0x6f, 0x67, 0x79, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50, 0x01,
	0x5a, 0x3d, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x74, 0x65, 0x6e,
	0x73, 0x6f, 0x72, 0x73, 0x79, 0x73, 0x74, 0x65, 0x6d, 0x73, 0x2f, 0x74, 0x65, 0x6e, 0x73, 0x6f,
	0x72, 0x65, 0x6d, 0x72, 0x2f, 0x6c, 0x69, 0x62, 0x73, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f,
	0x70, 0x6b, 0x67, 0x2f, 0x74, 0x65, 0x72, 0x6d, 0x69, 0x6e, 0x6f, 0x6c, 0x6f, 0x67, 0x79, 0x62,
	0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_pkg_terminology_terminology_proto_rawDescOnce sync.Once
	file_pkg_terminology_terminology_proto_rawDescData = file_pkg_terminology_terminology_proto_rawDesc
)

func file_pkg_terminology_terminology_proto_rawDescGZIP() []byte {
	file_pkg_terminology_terminology_proto_rawDescOnce.Do(func() {
		file_pkg_terminology_terminology_proto_rawDescData = protoimpl.X.CompressGZIP(file_pkg_terminology_terminology_proto_rawDescData)
	})
	return file_pkg_terminology_terminology_proto_rawDescData
}

var file_pkg_terminology_terminology_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_pkg_terminology_terminology_proto_goTypes = []interface{}{
	(*EmptyRequest)(nil),             // 0: main.EmptyRequest
	(*ConceptRequest)(nil),           // 1: main.ConceptRequest
	(*ConceptResponse)(nil),          // 2: main.ConceptResponse
	(*LookupRequest)(nil),            // 3: main.LookupRequest
	(*Concept)(nil),                  // 4: main.Concept
	(*ConceptsResponse)(nil),         // 5: main.ConceptsResponse
	(*ConceptAttributesRequest)(nil), // 6: main.ConceptAttributesRequest
	(*ConceptAttributes)(nil),        // 7: main.ConceptAttributes
	(*ConceptAttributeResponse)(nil), // 8: main.ConceptAttributeResponse
}
var file_pkg_terminology_terminology_proto_depIdxs = []int32{
	4, // 0: main.ConceptResponse.concept:type_name -> main.Concept
	4, // 1: main.ConceptsResponse.items:type_name -> main.Concept
	4, // 2: main.ConceptAttributes.association:type_name -> main.Concept
	4, // 3: main.ConceptAttributes.description:type_name -> main.Concept
	7, // 4: main.ConceptAttributeResponse.attributes:type_name -> main.ConceptAttributes
	3, // 5: main.Terminology.GetHistoryOfDisorders:input_type -> main.LookupRequest
	6, // 6: main.Terminology.GetConceptAttributes:input_type -> main.ConceptAttributesRequest
	5, // 7: main.Terminology.GetHistoryOfDisorders:output_type -> main.ConceptsResponse
	8, // 8: main.Terminology.GetConceptAttributes:output_type -> main.ConceptAttributeResponse
	7, // [7:9] is the sub-list for method output_type
	5, // [5:7] is the sub-list for method input_type
	5, // [5:5] is the sub-list for extension type_name
	5, // [5:5] is the sub-list for extension extendee
	0, // [0:5] is the sub-list for field type_name
}

func init() { file_pkg_terminology_terminology_proto_init() }
func file_pkg_terminology_terminology_proto_init() {
	if File_pkg_terminology_terminology_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_pkg_terminology_terminology_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EmptyRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*LookupRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Concept); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptsResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptAttributesRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptAttributes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_pkg_terminology_terminology_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ConceptAttributeResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_pkg_terminology_terminology_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_pkg_terminology_terminology_proto_goTypes,
		DependencyIndexes: file_pkg_terminology_terminology_proto_depIdxs,
		MessageInfos:      file_pkg_terminology_terminology_proto_msgTypes,
	}.Build()
	File_pkg_terminology_terminology_proto = out.File
	file_pkg_terminology_terminology_proto_rawDesc = nil
	file_pkg_terminology_terminology_proto_goTypes = nil
	file_pkg_terminology_terminology_proto_depIdxs = nil
}
