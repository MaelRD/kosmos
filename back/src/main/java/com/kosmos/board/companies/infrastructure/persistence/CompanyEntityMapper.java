package com.kosmos.board.companies.infrastructure.persistence;

import com.kosmos.board.companies.domain.model.Company;

final class CompanyEntityMapper {

    private CompanyEntityMapper() {
    }

    static Company toDomain(CompanyEntity entity) {
        return new Company(entity.id, entity.name);
    }
}
