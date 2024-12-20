package de.tum.in.www1.artemis.service.programming;

import static de.tum.in.www1.artemis.config.Constants.PROFILE_CORE;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import de.tum.in.www1.artemis.domain.enumeration.ProgrammingLanguage;

/**
 * The policy for choosing the appropriate service for upgrading of template files
 */
@Profile(PROFILE_CORE)
@Service
public class TemplateUpgradePolicyService {

    private final JavaTemplateUpgradeService javaRepositoryUpgradeService;

    private final DefaultTemplateUpgradeService defaultRepositoryUpgradeService;

    public TemplateUpgradePolicyService(JavaTemplateUpgradeService javaRepositoryUpgradeService, DefaultTemplateUpgradeService defaultRepositoryUpgradeService) {
        this.javaRepositoryUpgradeService = javaRepositoryUpgradeService;
        this.defaultRepositoryUpgradeService = defaultRepositoryUpgradeService;
    }

    /**
     * Returns a programming language specific service which upgrades the template files in repositories.
     *
     * @param programmingLanguage The programming language of the programming exercise to be upgraded
     * @return The upgrade service for the programming language
     */
    public TemplateUpgradeService getUpgradeService(ProgrammingLanguage programmingLanguage) {
        return switch (programmingLanguage) {
            case JAVA -> javaRepositoryUpgradeService;
            case KOTLIN, PYTHON, C, HASKELL, VHDL, ASSEMBLER, SWIFT, OCAML, EMPTY, RUST -> defaultRepositoryUpgradeService;
            case JAVASCRIPT, C_SHARP, C_PLUS_PLUS, SQL, R, TYPESCRIPT, GO, MATLAB, BASH, RUBY, POWERSHELL, ADA, DART, PHP ->
                throw new UnsupportedOperationException("Unsupported programming language: " + programmingLanguage);
        };
    }
}
