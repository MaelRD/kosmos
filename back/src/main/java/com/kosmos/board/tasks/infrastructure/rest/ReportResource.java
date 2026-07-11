package com.kosmos.board.tasks.infrastructure.rest;

import com.kosmos.board.tasks.domain.model.BoardReport;
import com.kosmos.board.tasks.domain.port.in.GetBoardReportUseCase;
import io.quarkus.security.Authenticated;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/reports/summary")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ReportResource {

    private final GetBoardReportUseCase getBoardReportUseCase;

    public ReportResource(GetBoardReportUseCase getBoardReportUseCase) {
        this.getBoardReportUseCase = getBoardReportUseCase;
    }

    @GET
    public BoardReport getSummary() {
        return getBoardReportUseCase.getReport();
    }
}
