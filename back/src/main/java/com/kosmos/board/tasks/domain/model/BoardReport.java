package com.kosmos.board.tasks.domain.model;

import java.util.List;

/**
 * Read model backing the Informes view: aggregate counts derived from the current
 * task list, computed on demand rather than persisted.
 */
public record BoardReport(
        int totalTasks,
        int doneTasks,
        int progressTasks,
        int percentDone,
        Double averageResolutionDays,
        List<MemberStat> memberStats,
        List<PriorityStat> priorityStats) {

    public record MemberStat(
            String assignee,
            long assigned,
            long done,
            int percentDone,
            Double averageResolutionDays,
            boolean topPerformer,
            boolean mostActive) {
    }

    public record PriorityStat(Priority priority, long count, int percentOfTotal) {
    }
}
