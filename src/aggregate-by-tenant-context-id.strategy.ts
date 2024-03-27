import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';

const tenants = new Map<string, ContextId>();

/**
 * 많은 사용자가 singletone 객체에 요청을 보내게 되면 다른 사용자의 정보를 또 다른 사용자가 갈취할 수 있는 문제가 발생할 수 있음. 이 때, scope를 REQUEST로 줌으로써 매번 객체를 새로 생성할 수도 있지만, 그렇게 되면 수십 수백만의 요청이 왔을 때 매 요청마다 새로 인스턴스를 만들고 Garbage collection을 수행하면서 부하가 걸리게 됨.
 *
 * 이런 상황을 해결하기 위해 sub-tree 구조를 통해 사용자들을 각각의 sub-tree id를 가진 방을 만들어 해결하는 방법이 있음.
 */
export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(
    contextId: ContextId,
    request: any,
  ): ContextIdResolverFn | ContextIdResolver | undefined {
    const tenantId = request.headers['x-tenant-id'] as string;
    let tenantSubTreeId: ContextId;

    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId) as ContextId;
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // tree가 부하가 심하다면 원본 contextId 리턴
    return {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubTreeId : contextId,
      payload: { tenantId }, // payload를 넘겨주고 싶을 경우
    };
  }
}
