package com.kosmos.board.users.domain.port.in;

import com.kosmos.board.users.domain.model.User;
import java.util.List;

public interface ListUsersUseCase {

    List<User> listUsers();
}
