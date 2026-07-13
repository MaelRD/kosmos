package com.kosmos.board.companies.application;

import com.kosmos.board.companies.domain.model.Company;
import com.kosmos.board.companies.domain.port.in.AssignCompaniesUseCase;
import com.kosmos.board.companies.domain.port.in.ListCompaniesUseCase;
import com.kosmos.board.companies.domain.port.out.CompanyRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class CompanyService implements ListCompaniesUseCase, AssignCompaniesUseCase {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public List<Company> listCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Map<UUID, List<UUID>> listAssignments() {
        return companyRepository.findAllAssignments();
    }

    @Override
    @Transactional
    public List<UUID> assignCompaniesToUser(UUID userId, List<UUID> companyIds) {
        companyRepository.replaceAssignmentsForUser(userId, companyIds);
        return companyIds;
    }
}
