package com.kosmos.board.users.infrastructure.persistence;

import com.kosmos.board.users.domain.model.User;

final class UserEntityMapper {

    private UserEntityMapper() {
    }

    static User toDomain(UserEntity entity) {
        return new User(
                entity.id,
                entity.email,
                entity.name,
                entity.passwordHash,
                entity.provider,
                entity.googleSub,
                entity.icalToken);
    }

    static UserEntity toEntity(User user) {
        UserEntity entity = new UserEntity();
        entity.id = user.id();
        entity.email = user.email();
        entity.name = user.name();
        entity.passwordHash = user.passwordHash();
        entity.provider = user.provider();
        entity.googleSub = user.googleSub();
        entity.icalToken = user.icalToken();
        return entity;
    }
}
