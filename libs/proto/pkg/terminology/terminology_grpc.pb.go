// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.5
// source: pkg/terminology/terminology.proto

package terminology

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// TerminologyClient is the client API for Terminology service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type TerminologyClient interface {
	SearchHistoryOfDisorders(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error)
	SearchFamilyHistory(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error)
	SearchProcedures(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error)
	GetConceptAttributes(ctx context.Context, in *ConceptAttributesRequest, opts ...grpc.CallOption) (*ConceptAttributeResponse, error)
}

type terminologyClient struct {
	cc grpc.ClientConnInterface
}

func NewTerminologyClient(cc grpc.ClientConnInterface) TerminologyClient {
	return &terminologyClient{cc}
}

func (c *terminologyClient) SearchHistoryOfDisorders(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error) {
	out := new(ConceptsResponse)
	err := c.cc.Invoke(ctx, "/main.Terminology/SearchHistoryOfDisorders", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *terminologyClient) SearchFamilyHistory(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error) {
	out := new(ConceptsResponse)
	err := c.cc.Invoke(ctx, "/main.Terminology/SearchFamilyHistory", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *terminologyClient) SearchProcedures(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error) {
	out := new(ConceptsResponse)
	err := c.cc.Invoke(ctx, "/main.Terminology/SearchProcedures", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *terminologyClient) GetConceptAttributes(ctx context.Context, in *ConceptAttributesRequest, opts ...grpc.CallOption) (*ConceptAttributeResponse, error) {
	out := new(ConceptAttributeResponse)
	err := c.cc.Invoke(ctx, "/main.Terminology/GetConceptAttributes", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// TerminologyServer is the server API for Terminology service.
// All implementations must embed UnimplementedTerminologyServer
// for forward compatibility
type TerminologyServer interface {
	SearchHistoryOfDisorders(context.Context, *LookupRequest) (*ConceptsResponse, error)
	SearchFamilyHistory(context.Context, *LookupRequest) (*ConceptsResponse, error)
	SearchProcedures(context.Context, *LookupRequest) (*ConceptsResponse, error)
	GetConceptAttributes(context.Context, *ConceptAttributesRequest) (*ConceptAttributeResponse, error)
	mustEmbedUnimplementedTerminologyServer()
}

// UnimplementedTerminologyServer must be embedded to have forward compatible implementations.
type UnimplementedTerminologyServer struct {
}

func (UnimplementedTerminologyServer) SearchHistoryOfDisorders(context.Context, *LookupRequest) (*ConceptsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SearchHistoryOfDisorders not implemented")
}
func (UnimplementedTerminologyServer) SearchFamilyHistory(context.Context, *LookupRequest) (*ConceptsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SearchFamilyHistory not implemented")
}
func (UnimplementedTerminologyServer) SearchProcedures(context.Context, *LookupRequest) (*ConceptsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SearchProcedures not implemented")
}
func (UnimplementedTerminologyServer) GetConceptAttributes(context.Context, *ConceptAttributesRequest) (*ConceptAttributeResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetConceptAttributes not implemented")
}
func (UnimplementedTerminologyServer) mustEmbedUnimplementedTerminologyServer() {}

// UnsafeTerminologyServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to TerminologyServer will
// result in compilation errors.
type UnsafeTerminologyServer interface {
	mustEmbedUnimplementedTerminologyServer()
}

func RegisterTerminologyServer(s grpc.ServiceRegistrar, srv TerminologyServer) {
	s.RegisterService(&Terminology_ServiceDesc, srv)
}

func _Terminology_SearchHistoryOfDisorders_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LookupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TerminologyServer).SearchHistoryOfDisorders(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.Terminology/SearchHistoryOfDisorders",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TerminologyServer).SearchHistoryOfDisorders(ctx, req.(*LookupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Terminology_SearchFamilyHistory_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LookupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TerminologyServer).SearchFamilyHistory(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.Terminology/SearchFamilyHistory",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TerminologyServer).SearchFamilyHistory(ctx, req.(*LookupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Terminology_SearchProcedures_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LookupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TerminologyServer).SearchProcedures(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.Terminology/SearchProcedures",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TerminologyServer).SearchProcedures(ctx, req.(*LookupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Terminology_GetConceptAttributes_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ConceptAttributesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TerminologyServer).GetConceptAttributes(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.Terminology/GetConceptAttributes",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TerminologyServer).GetConceptAttributes(ctx, req.(*ConceptAttributesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Terminology_ServiceDesc is the grpc.ServiceDesc for Terminology service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Terminology_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "main.Terminology",
	HandlerType: (*TerminologyServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "SearchHistoryOfDisorders",
			Handler:    _Terminology_SearchHistoryOfDisorders_Handler,
		},
		{
			MethodName: "SearchFamilyHistory",
			Handler:    _Terminology_SearchFamilyHistory_Handler,
		},
		{
			MethodName: "SearchProcedures",
			Handler:    _Terminology_SearchProcedures_Handler,
		},
		{
			MethodName: "GetConceptAttributes",
			Handler:    _Terminology_GetConceptAttributes_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "pkg/terminology/terminology.proto",
}
