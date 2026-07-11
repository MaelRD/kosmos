package com.kosmos.board.users.infrastructure.persistence;

import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.users.domain.port.out.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepositoryAdapter implements UserRepository {

    private final UserPanacheRepository panacheRepository;

    public UserRepositoryAdapter(UserPanacheRepository panacheRepository) {
        this.panacheRepository = panacheRepository;
    }

    @Override
    public List<User> findAll() {
        return panacheRepository.listAll().stream().map(UserEntityMapper::toDomain).toList();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return panacheRepository.find("email", email).firstResultOptional().map(UserEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findByGoogleSub(String googleSub) {
        return panacheRepository.find("googleSub", googleSub).firstResultOptional().map(UserEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findByIcalToken(UUID icalToken) {
        return panacheRepository.find("icalToken", icalToken).firstResultOptional().map(UserEntityMapper::toDomain);
    }

    @Override
    public User save(User user) {
        UserEntity entity = UserEntityMapper.toEntity(user);
        panacheRepository.getEntityManager().merge(entity);
        return user;
    }
}
