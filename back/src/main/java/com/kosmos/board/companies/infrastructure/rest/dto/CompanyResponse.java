package com.kosmos.board.companies.infrastructure.rest.dto;

import com.kosmos.board.companies.domain.model.Company;
import java.util.UUID;

public record CompanyResponse(UUID id, String name) {

    public static CompanyResponse from(Company company) {
        return new CompanyResponse(company.id(), company.name());
    }
}
