package de.tum.in.www1.artemis.web.rest.science;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import de.tum.in.www1.artemis.security.annotations.EnforceAtLeastStudent;
import de.tum.in.www1.artemis.service.feature.Feature;
import de.tum.in.www1.artemis.service.feature.FeatureToggle;
import de.tum.in.www1.artemis.service.science.ScienceEventService;
import de.tum.in.www1.artemis.web.rest.dto.science.ScienceEventDTO;

/**
 * REST controller providing the science related endpoints.
 */
@RestController
@RequestMapping("api/")
public class ScienceResource {

    private static final Logger log = LoggerFactory.getLogger(ScienceResource.class);

    private final ScienceEventService scienceEventService;

    public ScienceResource(ScienceEventService scienceEventService) {
        this.scienceEventService = scienceEventService;
    }

    /**
     * PUT science : Logs an event of the given type in the event list
     *
     * @param event the type of the event that should be logged
     * @return the ResponseEntity with status 200 (OK)
     */
    @PutMapping(value = "science")
    @FeatureToggle(Feature.Science)
    @EnforceAtLeastStudent
    public ResponseEntity<Void> science(@RequestBody ScienceEventDTO event) {
        log.debug("REST request to log science event of type {}", event);
        scienceEventService.logEvent(event);
        return ResponseEntity.ok().build();
    }
}
