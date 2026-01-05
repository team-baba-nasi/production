import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 シードデータの投入を開始します...");

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash("password123", 10);

    // ユーザーの作成
    console.log("👤 ユーザーを作成中...");
    const users = await Promise.all([
        prisma.user.create({
            data: {
                username: "yamada_taro",
                email: "yamada@example.com",
                password: hashedPassword,
                role: "admin",
                profile_image_url: "https://i.pravatar.cc/150?img=1",
            },
        }),
        prisma.user.create({
            data: {
                username: "sato_hanako",
                email: "sato@example.com",
                password: hashedPassword,
                role: "user",
                profile_image_url: "https://i.pravatar.cc/150?img=2",
            },
        }),
        prisma.user.create({
            data: {
                username: "tanaka_jiro",
                email: "tanaka@example.com",
                password: hashedPassword,
                role: "user",
                profile_image_url: "https://i.pravatar.cc/150?img=3",
            },
        }),
        prisma.user.create({
            data: {
                username: "suzuki_yuki",
                email: "suzuki@example.com",
                password: hashedPassword,
                role: "user",
                profile_image_url: "https://i.pravatar.cc/150?img=4",
            },
        }),
        prisma.user.create({
            data: {
                username: "takahashi_kenji",
                email: "takahashi@example.com",
                password: hashedPassword,
                role: "user",
                profile_image_url: "https://i.pravatar.cc/150?img=5",
            },
        }),
    ]);

    console.log(`✅ ${users.length}人のユーザーを作成しました`);

    // フォロー関係の作成
    console.log("🔗 フォロー関係を作成中...");
    await Promise.all([
        prisma.follow.create({
            data: {
                following_user_id: users[0].id,
                followed_user_id: users[1].id,
            },
        }),
        prisma.follow.create({
            data: {
                following_user_id: users[0].id,
                followed_user_id: users[2].id,
            },
        }),
        prisma.follow.create({
            data: {
                following_user_id: users[1].id,
                followed_user_id: users[0].id,
            },
        }),
        prisma.follow.create({
            data: {
                following_user_id: users[2].id,
                followed_user_id: users[0].id,
            },
        }),
        prisma.follow.create({
            data: {
                following_user_id: users[3].id,
                followed_user_id: users[1].id,
            },
        }),
    ]);

    console.log("✅ フォロー関係を作成しました");

    // グループの作成
    console.log("👥 グループを作成中...");
    const groups = await Promise.all([
        prisma.group.create({
            data: {
                name: "大阪グルメ探訪",
                owner_id: users[0].id,
                description: "大阪の美味しいお店を共有するグループ",
                status: "active",
                icon_image_url: "https://picsum.photos/seed/group1/200",
            },
        }),
        prisma.group.create({
            data: {
                name: "カフェ好き集まれ",
                owner_id: users[1].id,
                description: "おしゃれなカフェを巡るグループ",
                status: "active",
                icon_image_url: "https://picsum.photos/seed/group2/200",
            },
        }),
        prisma.group.create({
            data: {
                name: "週末アウトドア",
                owner_id: users[2].id,
                description: "キャンプやハイキングを楽しむグループ",
                status: "active",
                icon_image_url: "https://picsum.photos/seed/group3/200",
            },
        }),
    ]);

    console.log(`✅ ${groups.length}個のグループを作成しました`);

    // グループメンバーの作成
    console.log("👤 グループメンバーを追加中...");
    await Promise.all([
        // 大阪グルメ探訪
        prisma.groupMember.create({
            data: { group_id: groups[0].id, user_id: users[0].id, role: "admin" },
        }),
        prisma.groupMember.create({
            data: { group_id: groups[0].id, user_id: users[1].id, role: "member" },
        }),
        prisma.groupMember.create({
            data: { group_id: groups[0].id, user_id: users[2].id, role: "member" },
        }),
        // カフェ好き集まれ
        prisma.groupMember.create({
            data: { group_id: groups[1].id, user_id: users[1].id, role: "admin" },
        }),
        prisma.groupMember.create({
            data: { group_id: groups[1].id, user_id: users[3].id, role: "member" },
        }),
        prisma.groupMember.create({
            data: { group_id: groups[1].id, user_id: users[4].id, role: "member" },
        }),
        // 週末アウトドア
        prisma.groupMember.create({
            data: { group_id: groups[2].id, user_id: users[2].id, role: "admin" },
        }),
        prisma.groupMember.create({
            data: { group_id: groups[2].id, user_id: users[0].id, role: "member" },
        }),
    ]);

    console.log("✅ グループメンバーを追加しました");

    // ピンの作成
    console.log("📍 ピンを作成中...");
    const pins = await Promise.all([
        prisma.pin.create({
            data: {
                user_id: users[0].id,
                group_id: groups[0].id,
                place_id: "ChIJSZ4ycvCLGGARhZWEb_3OfDQ",
                place_name: "あづま 有楽町新国際ビル",
                place_address: "千代田区丸の内３丁目４−１ 新国際ビルB1",
                latitude: 35.676633,
                longitude: 139.762167,
                comment: "test",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[1].id,
                group_id: groups[1].id,
                place_id: "ChIJVVVFgBPnAGARLbCliBbVOI8",
                place_name: "かに道楽 道頓堀本店",
                place_address: "大阪市中央区道頓堀１丁目６−１８",
                latitude: 34.6687993,
                longitude: 135.5014873,
                comment: "grs",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[2].id,
                group_id: groups[2].id,
                place_id: "ChIJgbD0vvCTGGARCJYb0dKm4jE",
                place_name: "1110 CAFE/BAKERY",
                place_address: "川口市領家５丁目４−１",
                latitude: 35.7891409,
                longitude: 139.7408302,
                comment: "gyvt",
                status: "scheduled",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[0].id,
                group_id: groups[0].id,
                place_id: "ChIJryo9d1uJGGARgdvUgLj-aYQ",
                place_name: "ニューカヤバ",
                place_address: "中央区日本橋茅場町２丁目１７−１１",
                latitude: 35.6788526,
                longitude: 139.7808677,
                comment: "てすと",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[3].id,
                group_id: groups[1].id,
                place_id: "ChIJDS_57WeJGGARS7nfB7QmlVs",
                place_name: "鶏鬨 新川店",
                place_address: "中央区新川２丁目２６−１１ 平和自動車ビル B1~2F",
                latitude: 35.6739952,
                longitude: 139.7827614,
                comment: "tex",
                status: "closed",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[3].id,
                group_id: null,
                place_id: "ChIJo06D01WJGGARsG8wm7KW0Rw",
                place_name: "日本橋 天丼 金子半之助 日本橋総本店",
                place_address: "中央区日本橋室町１丁目１１−１５",
                latitude: 35.6853778,
                longitude: 139.7752665,
                comment: "mbuu",
                status: "closed",
            },
        }),
    ]);

    console.log(`✅ ${pins.length}個のピンを作成しました`);

    // ピンリアクションの作成
    console.log("👍 リアクションを作成中...");
    await Promise.all([
        prisma.pinReaction.create({
            data: { pin_id: pins[0].id, user_id: users[1].id, reaction_type: "like" },
        }),
        prisma.pinReaction.create({
            data: { pin_id: pins[0].id, user_id: users[2].id, reaction_type: "want_to_go" },
        }),
        prisma.pinReaction.create({
            data: { pin_id: pins[1].id, user_id: users[3].id, reaction_type: "like" },
        }),
        prisma.pinReaction.create({
            data: { pin_id: pins[2].id, user_id: users[0].id, reaction_type: "want_to_go" },
        }),
        prisma.pinReaction.create({
            data: { pin_id: pins[3].id, user_id: users[1].id, reaction_type: "been_there" },
        }),
    ]);

    console.log("✅ リアクションを作成しました");

    // スケジュールの作成
    console.log("📅 スケジュールを作成中...");
    const schedules = await Promise.all([
        prisma.schedule.create({
            data: {
                pin_id: pins[2].id,
                organizer_id: users[2].id,
                proposed_date_start: new Date("2025-11-20T10:00:00"),
                proposed_date_end: new Date("2025-11-20T16:00:00"),
                status: "proposed",
                description: "箕面公園でハイキングしましょう！",
            },
        }),
        prisma.schedule.create({
            data: {
                pin_id: pins[0].id,
                organizer_id: users[0].id,
                proposed_date_start: new Date("2025-11-25T18:00:00"),
                proposed_date_end: new Date("2025-11-25T20:00:00"),
                final_date: new Date("2025-11-25T18:30:00"),
                status: "confirmed",
                description: "たこ焼きを食べに行きましょう！",
            },
        }),
    ]);

    console.log(`✅ ${schedules.length}個のスケジュールを作成しました`);

    // スケジュールレスポンスの作成
    console.log("✍️ スケジュールレスポンスを作成中...");
    await Promise.all([
        prisma.scheduleResponse.create({
            data: {
                schedule_id: schedules[0].id,
                user_id: users[0].id,
                response_type: "accepted",
                comment: "参加します！楽しみです",
            },
        }),
        prisma.scheduleResponse.create({
            data: {
                schedule_id: schedules[0].id,
                user_id: users[2].id,
                response_type: "accepted",
                comment: "幹事やります",
            },
        }),
        prisma.scheduleResponse.create({
            data: {
                schedule_id: schedules[1].id,
                user_id: users[1].id,
                response_type: "accepted",
                comment: "行きます！",
            },
        }),
    ]);

    console.log("✅ スケジュールレスポンスを作成しました");

    // チャットルームの作成
    console.log("💬 チャットルームを作成中...");
    const chatRooms = await Promise.all([
        prisma.chatRoom.create({
            data: {
                pin_id: pins[0].id,
                room_type: "pin",
            },
        }),
        prisma.chatRoom.create({
            data: {
                pin_id: pins[2].id,
                room_type: "pin",
            },
        }),
        prisma.chatRoom.create({
            data: {
                room_type: "direct",
            },
        }),
    ]);

    console.log(`✅ ${chatRooms.length}個のチャットルームを作成しました`);

    // チャット参加者の作成
    console.log("👥 チャット参加者を追加中...");
    await Promise.all([
        // ピン1のチャット
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[0].id, user_id: users[0].id, last_read_at: new Date() },
        }),
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[0].id, user_id: users[1].id, last_read_at: new Date() },
        }),
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[0].id, user_id: users[2].id },
        }),
        // ピン3のチャット
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[1].id, user_id: users[2].id, last_read_at: new Date() },
        }),
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[1].id, user_id: users[0].id },
        }),
        // ダイレクトチャット
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[2].id, user_id: users[0].id, last_read_at: new Date() },
        }),
        prisma.chatParticipant.create({
            data: { chat_room_id: chatRooms[2].id, user_id: users[1].id, last_read_at: new Date() },
        }),
    ]);

    console.log("✅ チャット参加者を追加しました");

    // メッセージの作成
    console.log("💌 メッセージを作成中...");
    await Promise.all([
        prisma.message.create({
            data: {
                chat_room_id: chatRooms[0].id,
                sender_id: users[0].id,
                content: "このたこ焼き屋さん、本当におすすめです！",
                message_type: "text",
            },
        }),
        prisma.message.create({
            data: {
                chat_room_id: chatRooms[0].id,
                sender_id: users[1].id,
                content: "いいですね！今週末行きましょう",
                message_type: "text",
            },
        }),
        prisma.message.create({
            data: {
                chat_room_id: chatRooms[0].id,
                sender_id: users[2].id,
                content: "私も参加したいです👍",
                message_type: "text",
            },
        }),
        prisma.message.create({
            data: {
                chat_room_id: chatRooms[1].id,
                sender_id: users[2].id,
                content: "箕面公園の紅葉、見頃だそうです",
                message_type: "text",
            },
        }),
        prisma.message.create({
            data: {
                chat_room_id: chatRooms[1].id,
                sender_id: users[0].id,
                content: "楽しみですね！何時集合にしますか？",
                message_type: "text",
            },
        }),
    ]);

    console.log("✅ メッセージを作成しました");

    // 確定した待ち合わせ情報の作成
    console.log("📍 確定した待ち合わせ情報を作成中...");
    await Promise.all([
        prisma.confirmedMeeting.create({
            data: {
                chat_room_id: chatRooms[0].id,
                place_name: "山根屋",
                place_address: "大阪府大阪市北区中崎西1丁目4−22",
                meeting_date: new Date("2025-12-12T17:00:00"),
                meeting_end: new Date("2025-12-12T19:00:00"),
                status: "confirmed",
            },
        }),
        prisma.confirmedMeeting.create({
            data: {
                chat_room_id: chatRooms[1].id,
                place_name: "1110 CAFE/BAKERY",
                place_address: "川口市領家５丁目４−１",
                meeting_date: new Date("2025-11-20T10:00:00"),
                meeting_end: new Date("2025-11-20T16:00:00"),
                status: "confirmed",
            },
        }),
    ]);

    console.log("✅ 確定した待ち合わせ情報を作成しました");

    // 通知の作成
    console.log("🔔 通知を作成中...");
    await Promise.all([
        prisma.notification.create({
            data: {
                user_id: users[0].id,
                type: "follow",
                reference_type: "user",
                reference_id: users[1].id,
                title: "新しいフォロワー",
                message: "sato_hanakoさんがあなたをフォローしました",
                is_read: false,
            },
        }),
        prisma.notification.create({
            data: {
                user_id: users[1].id,
                type: "reaction",
                reference_type: "pin",
                reference_id: pins[0].id,
                title: "ピンへのリアクション",
                message: "yamada_taroさんがあなたのピンに「いいね」しました",
                is_read: true,
            },
        }),
        prisma.notification.create({
            data: {
                user_id: users[0].id,
                type: "schedule",
                reference_type: "schedule",
                reference_id: schedules[0].id,
                title: "新しいスケジュール",
                message: "tanaka_jiroさんがスケジュールを作成しました",
                is_read: false,
            },
        }),
        prisma.notification.create({
            data: {
                user_id: users[2].id,
                type: "message",
                reference_type: "chat_room",
                reference_id: chatRooms[0].id,
                title: "新しいメッセージ",
                message: "yamada_taroさんからメッセージが届きました",
                is_read: false,
            },
        }),
    ]);

    console.log("✅ 通知を作成しました");

    console.log("🎉 シードデータの投入が完了しました！");
}

main()
    .catch((e) => {
        console.error("❌ エラーが発生しました:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
