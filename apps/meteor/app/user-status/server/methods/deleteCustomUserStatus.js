import { Meteor } from 'meteor/meteor';
import { CustomUserStatus } from '@rocket.chat/models';
import { api } from '@rocket.chat/core-services';

import { hasPermission } from '../../../authorization/server';

Meteor.methods({
	async deleteCustomUserStatus(userStatusID) {
		if (!hasPermission(this.userId, 'manage-user-status')) {
			throw new Meteor.Error('not_authorized');
		}

		const userStatus = await CustomUserStatus.findOneById(userStatusID);
		if (userStatus == null) {
			throw new Meteor.Error('Custom_User_Status_Error_Invalid_User_Status', 'Invalid user status', { method: 'deleteCustomUserStatus' });
		}

		await CustomUserStatus.removeById(userStatusID);
		void api.broadcast('user.deleteCustomStatus', userStatus);

		return true;
	},
});
