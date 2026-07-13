package com.kosmos.board.companies.infrastructure.rest;

import com.kosmos.board.companies.domain.port.in.AssignCompaniesUseCase;
import com.kosmos.board.companies.domain.port.in.ListCompaniesUseCase;
import com.kosmos.board.companies.infrastructure.rest.dto.AssignCompaniesRequest;
import com.kosmos.board.companies.infrastructure.rest.dto.AssignmentResponse;
import com.kosmos.board.companies.infrastructure.rest.dto.CompanyResponse;
import io.quarkus.security.Authenticated;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/api/companies")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class CompanyResource {

    private final ListCompaniesUseCase listCompaniesUseCase;
    private final AssignCompaniesUseCase assignCompaniesUseCase;

    public CompanyResource(ListCompaniesUseCase listCompaniesUseCase, AssignCompaniesUseCase assignCompaniesUseCase) {
        this.listCompaniesUseCase = listCompaniesUseCase;
        this.assignCompaniesUseCase = assignCompaniesUseCase;
    }

    @GET
    public List<CompanyResponse> listCompanies() {
        return listCompaniesUseCase.listCompanies().stream().map(CompanyResponse::from).toList();
    }

    @GET
    @Path("/assignments")
    public List<AssignmentResponse> listAssignments() {
        Map<UUID, List<UUID>> assignments = listCompaniesUseCase.listAssignments();
        return assignments.entrySet().stream()
                .map(entry -> new AssignmentResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    @PUT
    @Path("/assignments/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public AssignmentResponse assignCompanies(@PathParam("userId") UUID userId, AssignCompaniesRequest request) {
        List<UUID> companyIds = assignCompaniesUseCase.assignCompaniesToUser(userId, request.companyIds());
        return new AssignmentResponse(userId, companyIds);
    }
}
