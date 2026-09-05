import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from 'react';

import axios from 'axios';

import {
    createApiKey,
    getApiKeys,
    revokeApiKey,
} from '../api/apiKeyApi';

import type { ApiKey } from '../types/apiKey';
import type { ApiErrorResponse } from '../types/apiError';

export default function ApiKeysPage() {

    const [keys, setKeys] =
        useState<ApiKey[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [ownerName, setOwnerName] =
        useState('');

    const [scopes, setScopes] =
        useState('courses:read');

    const [validDays, setValidDays] =
        useState('30');

    const [newKeyValue, setNewKeyValue] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    /*
     * Tai danh sach API Key
     */
    const loadKeys = useCallback(
        async () => {

            setLoading(true);
            setError(null);

            try {

                const response =
                    await getApiKeys();

                setKeys(
                    response.data
                );

            } catch {

                setError(
                    'Khong tai duoc danh sach API Key.'
                );

            } finally {

                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    /*
     * Cap API Key moi
     */
    const handleCreate =
        async (
            event: FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();

            setError(null);
            setNewKeyValue(null);

            try {

                const response =
                    await createApiKey({
                        ownerName: ownerName.trim(),
                        scopes: scopes.trim(),
                        validDays:
                            validDays.trim()
                                ? Number(validDays)
                                : undefined,
                    });

                /*
                 * Chi hien thi key vua tao
                 * o khu vuc rieng.
                 */
                setNewKeyValue(
                    response.data.keyValue
                );

                setOwnerName('');

                await loadKeys();

            } catch (err) {

                if (
                    axios.isAxiosError<ApiErrorResponse>(
                        err
                    )
                    &&
                    err.response?.data?.message
                ) {

                    setError(
                        err.response.data.message
                    );

                } else {

                    setError(
                        'Cap API Key khong thanh cong.'
                    );
                }
            }
        };

    /*
     * Thu hoi API Key
     */
    const handleRevoke =
        async (
            apiKey: ApiKey
        ) => {

            const confirmed =
                window.confirm(
                    `Thu hoi API Key cua "${apiKey.ownerName}"?`
                );

            if (!confirmed) {
                return;
            }

            try {

                await revokeApiKey(
                    apiKey.id
                );

                await loadKeys();

            } catch {

                alert(
                    'Thu hoi khong thanh cong.'
                );
            }
        };

    return (
        <div
            style={{
                padding: 24,
                maxWidth: 900,
                margin: '0 auto',
            }}
        >

            <h1>
                Quan ly API Key doi tac
            </h1>

            {/* CAP KEY MOI */}
            <form
                onSubmit={handleCreate}
                style={{
                    border: '1px solid #ddd',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                }}
            >

                <h3>
                    Cap API Key moi
                </h3>

                <div
                    style={{
                        marginBottom: 12,
                    }}
                >

                    <label>
                        Ten doi tac
                    </label>

                    <br />

                    <input
                        value={ownerName}
                        onChange={(event) =>
                            setOwnerName(
                                event.target.value
                            )
                        }
                        required
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            padding: 8,
                        }}
                    />

                </div>

                <div
                    style={{
                        marginBottom: 12,
                    }}
                >

                    <label>
                        Scopes
                    </label>

                    <br />

                    <input
                        value={scopes}
                        onChange={(event) =>
                            setScopes(
                                event.target.value
                            )
                        }
                        required
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            padding: 8,
                        }}
                    />

                    <p
                        style={{
                            marginTop: 4,
                            fontSize: 13,
                            color: '#666',
                        }}
                    >
                        Vi du: courses:read
                    </p>

                </div>

                <div
                    style={{
                        marginBottom: 12,
                    }}
                >

                    <label>
                        Hieu luc
                        {' '}
                        (so ngay, de trong = vinh vien)
                    </label>

                    <br />

                    <input
                        type="number"
                        min="1"
                        value={validDays}
                        onChange={(event) =>
                            setValidDays(
                                event.target.value
                            )
                        }
                        style={{
                            width: 200,
                            padding: 8,
                        }}
                    />

                </div>

                {error && (
                    <p
                        style={{
                            color: '#b91c1c',
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                >
                    Cap API Key
                </button>

            </form>

            {/* KEY VUA TAO */}
            {newKeyValue && (

                <div
                    style={{
                        background: '#fef9c3',
                        padding: 16,
                        borderRadius: 8,
                        marginBottom: 24,
                    }}
                >

                    <strong>
                        Key vua tao
                        {' '}
                        (hay luu lai ngay):
                    </strong>

                    <pre
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            userSelect: 'all',
                        }}
                    >
            {newKeyValue}
          </pre>

                </div>
            )}

            {/* DANH SACH */}
            {loading ? (

                <p>
                    Dang tai...
                </p>

            ) : (

                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}
                >

                    <thead>

                    <tr
                        style={{
                            textAlign: 'left',
                            borderBottom:
                                '2px solid #333',
                        }}
                    >

                        <th>
                            Doi tac
                        </th>

                        <th>
                            Scopes
                        </th>

                        <th>
                            Trang thai
                        </th>

                        <th>
                            Het han
                        </th>

                        <th>
                            Thao tac
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {keys.map(
                        (apiKey) => (

                            <tr
                                key={apiKey.id}
                                style={{
                                    borderBottom:
                                        '1px solid #eee',
                                }}
                            >

                                <td>
                                    {apiKey.ownerName}
                                </td>

                                <td>
                                    {apiKey.scopes}
                                </td>

                                <td
                                    style={{
                                        color:
                                            apiKey.status ===
                                            'ACTIVE'
                                                ? '#15803d'
                                                : '#b91c1c',
                                    }}
                                >
                                    {apiKey.status}
                                </td>

                                <td>
                                    {apiKey.expiresAt
                                        ? new Date(
                                            apiKey.expiresAt
                                        ).toLocaleDateString(
                                            'vi-VN'
                                        )
                                        : 'Vinh vien'}
                                </td>

                                <td>

                                    {apiKey.status ===
                                        'ACTIVE' && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRevoke(
                                                        apiKey
                                                    )
                                                }
                                            >
                                                Thu hoi
                                            </button>

                                        )}

                                </td>

                            </tr>
                        )
                    )}

                    </tbody>

                </table>
            )}

        </div>
    );
}