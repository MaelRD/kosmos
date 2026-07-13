package com.kosmos.board.companies.infrastructure.rest.dto;

import java.util.List;
import java.util.UUID;

public record AssignCompaniesRequest(List<UUID> companyIds) {
}
