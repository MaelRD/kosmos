package com.kosmos.board.users.domain.port.out;

import com.kosmos.board.users.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    List<User> findAll();

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleSub(String googleSub);

    Optional<User> findByIcalToken(UUID icalToken);

    User save(User user);
}
