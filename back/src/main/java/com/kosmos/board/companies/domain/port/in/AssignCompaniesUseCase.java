package com.kosmos.board.companies.domain.port.in;

import java.util.List;
import java.util.UUID;

public interface AssignCompaniesUseCase {

    List<UUID> assignCompaniesToUser(UUID userId, List<UUID> companyIds);
}
