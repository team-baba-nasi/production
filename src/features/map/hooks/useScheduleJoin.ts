import { useState } from "react";
import { toast } from "sonner";
import {
    JoinScheduleParams,
    JoinScheduleResponse,
    ScheduleResponsesData,
    ScheduleResponse,
} from "../types/map";

export function useScheduleJoin() {
    const [isJoining, setIsJoining] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const joinSchedule = async (
        params: JoinScheduleParams
    ): Promise<JoinScheduleResponse | null> => {
        setIsJoining(true);
        try {
            const response = await fetch("/api/schedules/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "スケジュール参加に失敗しました");
            }

            const data: JoinScheduleResponse = await response.json();

            const messages = {
                going: "参加登録しました！",
                maybe: "検討中として登録しました",
                not_going: "不参加として登録しました",
            };
            toast.success(messages[params.response_type]);

            return data;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "スケジュール参加に失敗しました";
            toast.error(message);
            console.error("スケジュール参加エラー:", error);
            return null;
        } finally {
            setIsJoining(false);
        }
    };

    const fetchScheduleResponses = async (scheduleId: number): Promise<ScheduleResponse[]> => {
        setIsFetching(true);
        try {
            const response = await fetch(`/api/schedules/join?schedule_id=${scheduleId}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "参加状況の取得に失敗しました");
            }

            const data: ScheduleResponsesData = await response.json();
            return data.responses;
        } catch (error) {
            const message = error instanceof Error ? error.message : "参加状況の取得に失敗しました";
            toast.error(message);
            console.error("参加状況取得エラー:", error);
            return [];
        } finally {
            setIsFetching(false);
        }
    };

    return {
        joinSchedule,
        fetchScheduleResponses,
        isJoining,
        isFetching,
    };
}

/**
 * スケジュール参加状況を集計する関数
 */
export function summarizeResponses(responses: ScheduleResponse[]) {
    const going = responses.filter((r) => r.response_type === "going");
    const maybe = responses.filter((r) => r.response_type === "maybe");
    const notGoing = responses.filter((r) => r.response_type === "not_going");

    return {
        going,
        maybe,
        notGoing,
        goingCount: going.length,
        maybeCount: maybe.length,
        notGoingCount: notGoing.length,
        totalCount: responses.length,
    };
}

/**
 * ユーザーの参加状態を取得する関数
 */
export function getUserResponse(
    responses: ScheduleResponse[],
    userId: number
): ScheduleResponse | undefined {
    return responses.find((r) => r.user_id === userId);
}
