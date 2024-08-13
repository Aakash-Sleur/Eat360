import Loader from '@/components/loader';
import UserCard from '@/components/shared/user-card';
import { useGetUsers } from '@/lib/react-query/queries-and-mutations';
import { IUser } from '@/lib/types';

const UsersPage = () => {
    const { data: users, isLoading } = useGetUsers();


    return (
        <div className="common-container">
            <div className="user-container">
                <div className="w-full text-left h3-bold md:h2-bold">All Users</div>
                {
                    isLoading && !users ? (
                        <Loader />
                    ) : (
                        <ul className='user-grid'>
                            {users.map((user: IUser, idx: number) =>
                                <li className="flex-1 min-w-[200px] w-full" key={idx}>
                                    <UserCard user={user} />
                                </li>
                            )}
                        </ul>
                    )
                }
            </div>
        </div>
    )
}

export default UsersPage
