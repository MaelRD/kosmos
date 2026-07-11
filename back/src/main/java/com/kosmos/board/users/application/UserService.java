package com.kosmos.board.users.application;

import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.users.domain.port.in.ListUsersUseCase;
import com.kosmos.board.users.domain.port.out.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class UserService implements ListUsersUseCase {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> listUsers() {
        return userRepository.findAll();
    }
}
