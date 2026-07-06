"""Add review_comment to workflows

Revision ID: f3c2e0a85c6b
Revises: 5dcbdcec8321
Create Date: 2026-07-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f3c2e0a85c6b'
down_revision: Union[str, Sequence[str], None] = 'f0a9bb7aaf69'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'workflows',
        sa.Column('review_comment', sa.String(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('workflows', 'review_comment')
