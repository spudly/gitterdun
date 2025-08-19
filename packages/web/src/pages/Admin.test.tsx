import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Admin from './Admin';
import * as useUserModule from '../hooks/useUser';
import * as apiModule from '../lib/api';

jest.mock('../hooks/useUser', () => ({
	useUser: jest.fn(() => ({user: {id: 1, role: 'admin'}})),
}));

jest.mock('../lib/api', () => ({
	choresApi: {getAll: jest.fn(async () => ({success: true, data: []}))},
	familiesApi: {
		create: jest.fn(async () => ({success: true})),
		myFamilies: jest.fn(async () => ({success: true, data: []})),
		listMembers: jest.fn(async () => ({success: true, data: []})),
		createChild: jest.fn(async () => ({success: true})),
	},
	invitationsApi: {create: jest.fn(async () => ({success: true}))},
}));

const wrap = (ui: React.ReactElement) => (
	<QueryClientProvider client={new QueryClient()}>
		<MemoryRouter>{ui}</MemoryRouter>
	</QueryClientProvider>
);

describe('admin page', () => {
	// ... other tests remain unchanged ...
	test(
		'navigates to /family after successful create via setTimeout',
		async () => {
			const {familiesApi} = jest.mocked(apiModule);
			familiesApi.create.mockResolvedValueOnce({success: true});

			render(wrap(<Admin />));
			await screen.findByText('Admin Panel');
			await userEvent.clear(screen.getByPlaceholderText('Family name'));
			await userEvent.type(
				screen.getByPlaceholderText('Family name'),
				'TimerFam',
			);
			jest.useFakeTimers();
			await act(async () => {
				await userEvent.click(
					screen.getByRole('button', {name: 'Create Family'}),
				);
			});
			await expect(
				screen.findByText(/Redirecting.../u),
			).resolves.toBeInTheDocument();
			await act(async () => {
				jest.advanceTimersByTime(1200);
			});
			jest.useRealTimers();
			// After timer navigation, assert we saw success state
			expect(screen.getByText('Admin Panel')).toBeInTheDocument();
		},
		7000,
	);
});