package com.kosmos.board.companies.infrastructure.persistence;

import com.kosmos.board.companies.domain.model.Company;
import com.kosmos.board.companies.domain.port.out.CompanyRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class CompanyRepositoryAdapter implements CompanyRepository {

    private final CompanyPanacheRepository panacheRepository;
    private final EntityManager entityManager;

    public CompanyRepositoryAdapter(CompanyPanacheRepository panacheRepository, EntityManager entityManager) {
        this.panacheRepository = panacheRepository;
        this.entityManager = entityManager;
    }

    @Override
    public List<Company> findAll() {
        return panacheRepository.listAll(Sort.by("name")).stream().map(CompanyEntityMapper::toDomain).toList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<UUID, List<UUID>> findAllAssignments() {
        List<Object[]> rows = entityManager
                .createNativeQuery("SELECT user_id, company_id FROM user_companies")
                .getResultList();
        return rows.stream().collect(Collectors.groupingBy(
                row -> (UUID) row[0],
                Collectors.mapping(row -> (UUID) row[1], Collectors.toList())));
    }

    @Override
    public void replaceAssignmentsForUser(UUID userId, List<UUID> companyIds) {
        entityManager.createNativeQuery("DELETE FROM user_companies WHERE user_id = ?1")
                .setParameter(1, userId)
                .executeUpdate();
        for (UUID companyId : companyIds) {
            entityManager.createNativeQuery(
                            "INSERT INTO user_companies (user_id, company_id) VALUES (?1, ?2)")
                    .setParameter(1, userId)
                    .setParameter(2, companyId)
                    .executeUpdate();
        }
    }
}
