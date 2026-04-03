// 友链数据类型定义
export interface Friend {
	name: string;
	url: string;
	avatar: string;
	description: string;
}

// 友链数据
export const friends: Friend[] = [
	{
		name: "AcoFork Blog",
		url: "https://2x.nz/",
		avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=5",
		description: "Protect What You Love!",
	},
];
