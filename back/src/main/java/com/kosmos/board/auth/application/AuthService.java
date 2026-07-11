package com.kosmos.board.auth.application;

import com.kosmos.board.auth.domain.exception.EmailAlreadyRegisteredException;
import com.kosmos.board.auth.domain.exception.InvalidCredentialsException;
import com.kosmos.board.auth.domain.model.AuthResult;
import com.kosmos.board.auth.domain.model.GoogleIdentity;
import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.auth.domain.port.in.GoogleAuthCommand;
import com.kosmos.board.auth.domain.port.in.GoogleAuthUseCase;
import com.kosmos.board.auth.domain.port.in.LoginCommand;
import com.kosmos.board.auth.domain.port.in.LoginUseCase;
import com.kosmos.board.auth.domain.port.in.RegisterCommand;
import com.kosmos.board.auth.domain.port.in.RegisterUseCase;
import com.kosmos.board.auth.domain.port.out.GoogleIdTokenVerifier;
import com.kosmos.board.auth.domain.port.out.TokenIssuer;
import com.kosmos.board.users.domain.port.out.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService implements RegisterUseCase, LoginUseCase, GoogleAuthUseCase {

    private final UserRepository userRepository;
    private final TokenIssuer tokenIssuer;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;

    public AuthService(UserRepository userRepository, TokenIssuer tokenIssuer, GoogleIdTokenVerifier googleIdTokenVerifier) {
        this.userRepository = userRepository;
        this.tokenIssuer = tokenIssuer;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
    }

    @Override
    @Transactional
    public AuthResult register(RegisterCommand command) {
        String email = command.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyRegisteredException(email);
        }
        String hash = BcryptUtil.bcryptHash(command.password());
        User user = userRepository.save(User.localUser(email, command.name().trim(), hash));
        return new AuthResult(tokenIssuer.issueToken(user), user);
    }

    @Override
    public AuthResult login(LoginCommand command) {
        String email = command.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .filter(u -> u.passwordHash() != null)
                .orElseThrow(InvalidCredentialsException::new);
        if (!BcryptUtil.matches(command.password(), user.passwordHash())) {
            throw new InvalidCredentialsException();
        }
        return new AuthResult(tokenIssuer.issueToken(user), user);
    }

    @Override
    @Transactional
    public AuthResult authenticateWithGoogle(GoogleAuthCommand command) {
        GoogleIdentity identity = googleIdTokenVerifier.verify(command.idToken());

        User user = userRepository.findByGoogleSub(identity.sub())
                .or(() -> userRepository.findByEmail(identity.email()))
                .orElseGet(() -> userRepository.save(
                        User.googleUser(identity.email(), identity.name(), identity.sub())));

        return new AuthResult(tokenIssuer.issueToken(user), user);
    }
}
