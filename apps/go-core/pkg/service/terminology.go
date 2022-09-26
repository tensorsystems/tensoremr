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
	"context"
	"time"

	pb "github.com/tensorsystems/tensoremr/libs/proto/pkg/terminology"
	"google.golang.org/grpc"
)

type TerminologyService struct {
	GRPC *grpc.ClientConn
}

func (s *TerminologyService) SearchHistoryOfDisorders(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.SearchHistoryOfDisorders(ctx, &pb.LookupRequest{Size: size, SearchTerm: searchTerm})
}

func (s *TerminologyService) SearchFamilyHistory(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.SearchFamilyHistory(ctx, &pb.LookupRequest{Size: size, SearchTerm: searchTerm})
}

func (s *TerminologyService) SearchProcedures(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return c.SearchProcedures(ctx, &pb.LookupRequest{Size: size, SearchTerm: searchTerm})
}

func (s *TerminologyService) GetConceptAttributes(conceptID string) (*pb.ConceptAttributeResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.GetConceptAttributes(ctx, &pb.ConceptAttributesRequest{ConceptId: conceptID})
}

func (s *TerminologyService) GetConceptChildren(conceptID string) (*pb.ConceptChildrenResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.GetConceptChildren(ctx, &pb.ConceptChildrenRequest{ConceptId: conceptID})
}
