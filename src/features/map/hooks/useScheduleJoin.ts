import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
    JoinScheduleParams,
    JoinScheduleResponse,
    ScheduleResponsesData,
    ScheduleResponse,
    ScheduleJoinError,
} from "../types/map";

export function useJoinSchedule() {
    return useMutation<JoinScheduleResponse, AxiosError<ScheduleJoinError>, JoinScheduleParams>({
        mutationFn: async (params) => {
            const res = await axios.post("/maps/join", params);
            return res.data;
        },
        onSuccess: (data, variables) => {
            const messages = {
                going: "参加登録しました！",
                maybe: "検討中として登録しました",
                not_going: "不参加として登録しました",
            };
            toast.success(messages[variables.response_type]);
        },
        onError: (error) => {
            const message = error.response?.data.error || "スケジュール参加に失敗しました";
            toast.error(message);
            console.error("スケジュール参加エラー:", error);
        },
    });
}

/**
 * スケジュールの参加状況を取得するQuery
 */
export function useScheduleResponses(scheduleId: number, enabled = true) {
    return useQuery<ScheduleResponse[], AxiosError<ScheduleJoinError>>({
        queryKey: ["schedule-responses", scheduleId],
        queryFn: async () => {
            const res = await axios.get<ScheduleResponsesData>(
                `/maps/join?schedule_id=${scheduleId}`
            );
            return res.data.responses;
        },
        enabled: enabled && scheduleId > 0,
        staleTime: 1000 * 60 * 5, // 5分キャッシュ
    });
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
