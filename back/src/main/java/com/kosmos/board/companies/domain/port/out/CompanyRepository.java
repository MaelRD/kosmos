package com.kosmos.board.companies.domain.port.out;

import com.kosmos.board.companies.domain.model.Company;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CompanyRepository {

    List<Company> findAll();

    Map<UUID, List<UUID>> findAllAssignments();

    void replaceAssignmentsForUser(UUID userId, List<UUID> companyIds);
}
