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

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_HISTORY_OF_DISORDER})
}

func (s *TerminologyService) SearchFamilyHistory(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_FAMILY_HISTORY})
}

func (s *TerminologyService) SearchSocialHistory(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_SOCIAL_HISTORY})
}

func (s *TerminologyService) SearchLifestyle(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_LIFESTYLE})
}

func (s *TerminologyService) SearchAdministrativeStatus(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_ADMINISTRATIVE_STATUS})
}

func (s *TerminologyService) SearchMentalState(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_MENTAL_STATE})
}

func (s *TerminologyService) SearchImmunization(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_IMMUNIZATION})
}

func (s *TerminologyService) SearchAllergicCondition(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_ALLERGIC_CONDITION})
}

func (s *TerminologyService) SearchIntolerance(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_INTOLERANCE})
}

func (s *TerminologyService) SearchProcedures(size int64, searchTerm string) (*pb.ConceptsResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return c.Search(ctx, &pb.SearchRequest{Size: size, Term: searchTerm, Type: pb.SearchType_PROCEDURE})
}

func (s *TerminologyService) GetConceptAttributes(conceptID string) (*pb.ConceptAttributeResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return c.GetConceptAttributes(ctx, &pb.ConceptAttributesRequest{ConceptId: conceptID})
}

func (s *TerminologyService) GetConceptChildren(conceptID string) (*pb.ConceptChildrenResponse, error) {
	c := pb.NewTerminologyClient(s.GRPC)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return c.GetConceptChildren(ctx, &pb.ConceptChildrenRequest{ConceptId: conceptID})
}
