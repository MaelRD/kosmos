package com.kosmos.board.companies.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

@ApplicationScoped
public class CompanyPanacheRepository implements PanacheRepositoryBase<CompanyEntity, UUID> {
}
