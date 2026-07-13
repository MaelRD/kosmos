package com.kosmos.board.companies.domain.port.in;

import com.kosmos.board.companies.domain.model.Company;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ListCompaniesUseCase {

    List<Company> listCompanies();

    Map<UUID, List<UUID>> listAssignments();
}
