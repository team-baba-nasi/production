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
                place_id: "ChIJ1234567890",
                place_name: "道頓堀 たこ焼き たこ八",
                place_address: "大阪府大阪市中央区道頓堀1-7-21",
                latitude: 34.668531,
                longitude: 135.501678,
                comment: "絶品のたこ焼き！外はカリッと中はトロトロで最高です",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[1].id,
                group_id: groups[1].id,
                place_id: "ChIJ0987654321",
                place_name: "カフェ・ド・クリエ 梅田店",
                place_address: "大阪府大阪市北区梅田2-4-9",
                latitude: 34.702485,
                longitude: 135.495951,
                comment: "静かで落ち着いた雰囲気。作業にもぴったり",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[2].id,
                group_id: groups[2].id,
                place_id: "ChIJ1122334455",
                place_name: "箕面公園",
                place_address: "大阪府箕面市箕面公園1-18",
                latitude: 34.831556,
                longitude: 135.472222,
                comment: "紅葉の季節は特に美しい！ハイキングコースもおすすめ",
                status: "scheduled",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[0].id,
                group_id: groups[0].id,
                place_id: "ChIJ5566778899",
                place_name: "お好み焼き 千房 難波本店",
                place_address: "大阪府大阪市中央区難波3-7-3",
                latitude: 34.665888,
                longitude: 135.5,
                comment: "大阪の定番！ふわふわのお好み焼きが絶品",
                status: "open",
            },
        }),
        prisma.pin.create({
            data: {
                user_id: users[3].id,
                group_id: groups[1].id,
                place_id: "ChIJ9988776655",
                place_name: "スターバックス 中之島公園店",
                place_address: "大阪府大阪市北区中之島1-1-10",
                latitude: 34.691944,
                longitude: 135.506111,
                comment: "公園の緑を眺めながらゆっくりできる",
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
