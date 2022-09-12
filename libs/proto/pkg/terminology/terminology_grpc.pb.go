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
	GetHistoryOfDisorders(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error)
	GetConceptAttributes(ctx context.Context, in *ConceptAttributesRequest, opts ...grpc.CallOption) (*ConceptAttributeResponse, error)
}

type terminologyClient struct {
	cc grpc.ClientConnInterface
}

func NewTerminologyClient(cc grpc.ClientConnInterface) TerminologyClient {
	return &terminologyClient{cc}
}

func (c *terminologyClient) GetHistoryOfDisorders(ctx context.Context, in *LookupRequest, opts ...grpc.CallOption) (*ConceptsResponse, error) {
	out := new(ConceptsResponse)
	err := c.cc.Invoke(ctx, "/main.Terminology/GetHistoryOfDisorders", in, out, opts...)
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
	GetHistoryOfDisorders(context.Context, *LookupRequest) (*ConceptsResponse, error)
	GetConceptAttributes(context.Context, *ConceptAttributesRequest) (*ConceptAttributeResponse, error)
	mustEmbedUnimplementedTerminologyServer()
}

// UnimplementedTerminologyServer must be embedded to have forward compatible implementations.
type UnimplementedTerminologyServer struct {
}

func (UnimplementedTerminologyServer) GetHistoryOfDisorders(context.Context, *LookupRequest) (*ConceptsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetHistoryOfDisorders not implemented")
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

func _Terminology_GetHistoryOfDisorders_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LookupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TerminologyServer).GetHistoryOfDisorders(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.Terminology/GetHistoryOfDisorders",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TerminologyServer).GetHistoryOfDisorders(ctx, req.(*LookupRequest))
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
			MethodName: "GetHistoryOfDisorders",
			Handler:    _Terminology_GetHistoryOfDisorders_Handler,
		},
		{
			MethodName: "GetConceptAttributes",
			Handler:    _Terminology_GetConceptAttributes_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "pkg/terminology/terminology.proto",
}
