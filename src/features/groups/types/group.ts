// グループのオーナー
export type GroupOwner = {
    id: string | number;
    username: string;
};

export type Group = {
    id: string | number;
    name: string;
    description?: string | null;
    icon_image_url?: string | null;
    status?: string;
    created_at: string;
    owner: GroupOwner;
    role?: string;
};

//////////////////////////////////////////////////////////
// グループ作成
//////////////////////////////////////////////////////////

export type CreateGroupForm = {
    name: string;
    description?: string;
    icon_image_url?: string;
};

export type CreateGroupResponse = {
    group: Group;
};

export type CreateGroupError = {
    error: string;
    details?: { field: string; message: string }[];
};

//////////////////////////////////////////////////////////
// グループ一覧
//////////////////////////////////////////////////////////

export type GroupsResponse = {
    groups: {
        role: string;
        group: Group;
    }[];
};

//////////////////////////////////////////////////////////
// グループ詳細
//////////////////////////////////////////////////////////

export type GroupsError = {
    error: string;
};

export interface GroupResponse {
    group: {
        name: string;
        description: string | null;
        icon_image_url: string | null;
        owner_id: number;
        members: {
            user_id: number;
            role: string;
            user: {
                profile_image_url: string | null;
            };
        }[];
    };
    myRole: string;
}

//////////////////////////////////////////////////////////
// グループメンバー一覧
//////////////////////////////////////////////////////////

export type GroupMembersError = {
    error: string;
};

export interface GroupMembersResponse {
    groupmembers: {
        role: string;
        name: string;
        profile_image_url: string;
    }[];
}

//////////////////////////////////////////////////////////
// グループ情報アップデート
//////////////////////////////////////////////////////////

export interface UpdateGroupForm {
    name?: string;
    description?: string;
    icon_image_url?: string;
}

export interface UpdateGroupResponse {
    message: string;
    group: {
        id: number;
        name: string;
        description: string | null;
        icon_image_url: string | null;
        updated_at: string;
    };
}

export interface UpdateGroupError {
    error: string;
}

//////////////////////////////////////////////////////////
// グループ削除(アーカイブ)
//////////////////////////////////////////////////////////

export interface ArchiveGroupResponse {
    message: string;
    group: {
        id: number;
        name: string;
        status: string;
        updated_at: string;
    };
}

export interface ArchiveGroupError {
    error: string;
}
